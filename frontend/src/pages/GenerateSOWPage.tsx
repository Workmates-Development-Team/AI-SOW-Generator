import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { api } from '../lib/api';
import { useAuth } from '../lib/useAuth';
import LogoutButton from "../components/LogoutButton";
import SOWListButton from "../components/SOWListButton";
import { generateSowNumberAndDate } from '../utils/sowMeta';
import OptionalFieldsSelector from '../components/Generator/OptionalFieldsSelector';
import RequiredFieldsForm from '../components/Generator/RequiredFieldsForm';

const API_URL = import.meta.env.API_URL || 'http://localhost:5000';

interface FormState {
  clientName: string;
  projectDescription: string;
  requirements: string;
  duration: string;
  budget: string;
  supportService: string;
  legalTerms: string;
  deliverables: string;
  terminationClause: string;
  contactInformation: string;
}

interface OptionalField {
  id: keyof FormState;
  label: string;
  placeholder: string;
}

export default function GenerateSOWPage() {
  const [form, setForm] = useState<FormState>({
    clientName: '',
    projectDescription: '',
    requirements: '',
    duration: '',
    budget: '',
    supportService: '',
    legalTerms: '',
    deliverables: '',
    terminationClause: '',
    contactInformation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { token, setToken } = useAuth();

  // Optional fields list
  const optionalFields: OptionalField[] = [
    {
      id: 'deliverables',
      label: 'Additional instructions for deliverables',
      placeholder: 'Provide additional instructions or notes for the deliverables',
    },
    {
      id: 'supportService',
      label: 'Additional instructions for Support Service',
      placeholder: 'e.g. 24/7 support, 1 year maintenance, etc.',
    },
    {
      id: 'legalTerms',
      label: 'Special Legal Terms',
      placeholder: 'e.g. NDA, IP ownership, etc.',
    },
    {
      id: 'terminationClause',
      label: 'Special Termination Clauses',
      placeholder: 'Describe any additional termination conditions or clauses',
    },
    {
      id: 'contactInformation',
      label: 'Contact Information',
      placeholder: 'Enter contact details (e.g. name, email, phone)',
    },
  ];
  const [addedOptionalFields, setAddedOptionalFields] = useState<Array<keyof FormState>>([]);
  const availableOptionalFields = optionalFields.filter(f => !addedOptionalFields.includes(f.id));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  // Resize handler for textareas
  const handleAutoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
  };

  // Enter to submit
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const formElement = e.currentTarget.form;
      if (formElement) {
        formElement.requestSubmit();
      }
    }
  };

  const handleAddOptionalField = (fieldId: keyof FormState) => {
    if (!addedOptionalFields.includes(fieldId)) {
      setAddedOptionalFields(prev => [...prev, fieldId]);
    }
  };
  const handleRemoveOptionalField = (fieldId: keyof FormState) => {
    setAddedOptionalFields(prev => prev.filter(id => id !== fieldId));
    setForm(prev => ({ ...prev, [fieldId]: '' }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.projectDescription.trim()) {
      setError('Client Name and Project Description are required.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const sowResponse = await fetch(`${API_URL}/api/generate-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.clientName.trim(),
          projectDescription: form.projectDescription.trim(),
          requirements: form.requirements.trim(),
          duration: form.duration.trim(),
          budget: form.budget.trim(),
          supportService: form.supportService.trim(),
          legalTerms: form.legalTerms.trim(),
          deliverables: form.deliverables.trim(),
          terminationClause: form.terminationClause.trim(),
          contactInformation: form.contactInformation.trim(),
        }),
      });
      const sowResult = await sowResponse.json();
      if (!sowResult.success) {
        setError(sowResult.error || 'Failed to generate SOW document');
        return;
      }
      // Attaching sowNumber and clientName
      const { template, totalSlides, ...sowDataToSave } = sowResult.data;
      const { sowNumber: generatedSowNumber, sowDate: generatedSowDate } = generateSowNumberAndDate();
      const slidesWithSOW = sowDataToSave.slides.map((slide: any) => {
        if (slide.template === 'cover') {
          return {
            ...slide,
            sowNumber: generatedSowNumber,
            sowDate: generatedSowDate,
          };
        }
        return slide;
      });
      const presentationWithSOW = { ...sowDataToSave, sowNumber: generatedSowNumber, clientName: form.clientName.trim(), slides: slidesWithSOW };
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      await api.sows.createSow(presentationWithSOW, token);
      navigate('/presentation', { state: { presentation: presentationWithSOW } });
    } catch (err: unknown) {
      setError(`Error: ${(err as Error).message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const totalInputLength = Object.values(form).reduce((acc, val) => acc + val.length, 0);
  const minWidth = 60;
  const maxWidth = 80;
  const maxInputLength = 500; 
  const widthPercent = Math.min(
    maxWidth,
    minWidth + ((maxWidth - minWidth) * Math.min(totalInputLength, maxInputLength)) / maxInputLength
  );
  const cardWidth = `${widthPercent}vw`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 flex items-center justify-center relative">
      {/* Top Toolbar */}
      <div className="w-full flex justify-center" style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'none' }}>
        <div className="mt-4 max-w-5xl w-full rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 flex items-center justify-between relative" style={{ minHeight: 40, fontSize: '0.95rem', pointerEvents: 'auto' }}>
          <div className="flex items-center gap-4">
            <SOWListButton />
          </div>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 text-sm font-medium select-none pointer-events-none flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Statement of Work (SOW) Generator
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <LogoutButton />
          </div>
        </div>
      </div>
      {/* Card content below toolbar */}
      <Card
        className="shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md p-0 md:p-2"
        style={{ width: cardWidth, minWidth: '400px', maxWidth: '80vw', transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="mt-8" />
        <CardContent className="space-y-8 px-8 pb-10 pt-2">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-2 max-h-[70vh] items-stretch">
              {/* Left column: Required fields */}
              <RequiredFieldsForm
                form={form}
                loading={loading}
                handleChange={handleChange}
                handleTextareaKeyDown={handleTextareaKeyDown}
                handleAutoResize={handleAutoResize}
              />

              {/* Separator */}
              <div className="hidden md:flex items-stretch mx-2">
                <Separator orientation="vertical" className="h-full bg-white/20" />
              </div>

              {/* Right column: Optional fields */}
              <OptionalFieldsSelector
                optionalFields={optionalFields}
                addedOptionalFields={addedOptionalFields}
                availableOptionalFields={availableOptionalFields}
                form={form}
                loading={loading}
                handleAddOptionalField={handleAddOptionalField}
                handleRemoveOptionalField={handleRemoveOptionalField}
                handleChange={handleChange}
                handleTextareaKeyDown={handleTextareaKeyDown}
                handleAutoResize={handleAutoResize}
              />
            </div>
            {/* Submit button below the columns */}
            <Button
              type="submit"
              disabled={loading || !form.projectDescription.trim()}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-yellow-500 hover:from-blue-700 hover:via-blue-800 hover:to-yellow-600 text-white border-0"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating SOW Document
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Generate SOW Document
                </>
              )}
            </Button>
          </form>
          {/* Error alert below the form */}
          {error && (
            <Alert
              variant="destructive"
              className="bg-red-500/20 border-red-500/50 text-white"
            >
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

