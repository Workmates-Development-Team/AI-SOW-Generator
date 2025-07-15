import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_BASE_URL;

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
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const [prefilledFromPrompt, setPrefilledFromPrompt] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { token, setToken } = useAuth();
  const [componentError, setComponentError] = useState<string | null>(null);

  useEffect(() => {
    console.log('GenerateSOWPage mounted');
    console.log('searchParams:', searchParams.toString());
    console.log('API_URL:', import.meta.env.VITE_API_BASE_URL);
    
    return () => {
      console.log('GenerateSOWPage unmounted');
    };
  }, []);

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

  // Prefill form if regenerate param is present in URL and sessionStorage has the prompt
  useEffect(() => {
    const initializeForm = async () => {
      try {
        console.log('Initializing form...');
        
        const regenerate = searchParams.get('regenerate');
        console.log('Regenerate parameter:', regenerate);
        
        if (regenerate) {
          const promptStr = sessionStorage.getItem('regeneratePrompt');
          console.log('Prompt from sessionStorage:', promptStr);
          
          if (promptStr) {
            try {
              const prompt = JSON.parse(promptStr);
              console.log('Parsed prompt:', prompt);
              
              const newFormState = {
                clientName: prompt.clientName || '',
                projectDescription: prompt.projectDescription || '',
                requirements: prompt.requirements || '',
                duration: prompt.duration || '',
                budget: prompt.budget || '',
                supportService: prompt.supportService || '',
                legalTerms: prompt.legalTerms || '',
                deliverables: prompt.deliverables || '',
                terminationClause: prompt.terminationClause || '',
                contactInformation: prompt.contactInformation || '',
              };
              
              console.log('Setting form state:', newFormState);
              setForm(newFormState);
              
              const optionalFieldIds = ['supportService', 'legalTerms', 'deliverables', 'terminationClause', 'contactInformation'];
              const presentOptionalFields = optionalFieldIds.filter((key) => prompt[key]?.trim());
              console.log('Setting optional fields:', presentOptionalFields);
              
              setAddedOptionalFields(presentOptionalFields as Array<keyof FormState>);
              setPrefilledFromPrompt(true);
              
              // Clear the prompt from sessionStorage
              sessionStorage.removeItem('regeneratePrompt');
            } catch (parseError) {
              console.error('Error parsing prompt from sessionStorage:', parseError);
              setComponentError(`Failed to parse prompt: ${parseError}`);
            }
          }
        }
      } catch (error) {
        console.error('Error in form initialization:', error);
        setComponentError(`Form initialization failed: ${error}`);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeForm();
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  // Resize handler for text-areas
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
      const requiredFields = {
        clientName: form.clientName.trim(),
        projectDescription: form.projectDescription.trim(),
        requirements: form.requirements.trim(),
        duration: form.duration.trim(),
        budget: form.budget.trim(),
      };
      const optionalFieldIds = [
        'supportService',
        'legalTerms',
        'deliverables',
        'terminationClause',
        'contactInformation',
      ];
      const optionalFieldsToSend = Object.fromEntries(
        addedOptionalFields
          .filter((field) => optionalFieldIds.includes(field))
          .map((field) => [field, form[field].trim()])
      );
      const requestBody = { ...requiredFields, ...optionalFieldsToSend };

      const sowResponse = await fetch(`${API_URL}/api/generate-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
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
      const presentationWithSOW = { ...sowDataToSave, sowNumber: generatedSowNumber, clientName: form.clientName.trim(), slides: slidesWithSOW, prompt: requestBody };
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

  const backgroundClass = theme === 'light' ? 'bg-linear-to-br from-gray-200 via-gray-300 to-gray-200' : 'bg-linear-to-br from-gray-900 via-gray-800 to-gray-900';
  const cardClass = theme === 'light' ? 'bg-white text-gray-800' : 'bg-white/10 text-white border-white/20';
  const textClass = theme === 'light' ? 'text-gray-800' : 'text-white/80';
  const inputClass = theme === 'light' ? 'bg-gray-200 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-blue-500' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40';

  // Debug log for form state
  console.log('GenerateSOWPage form:', form, 'addedOptionalFields:', addedOptionalFields);

  let requiredFieldsError = null;
  let optionalFieldsError = null;
  let requiredFieldsElem = null;
  let optionalFieldsElem = null;
  try {
    requiredFieldsElem = (
      <RequiredFieldsForm
        form={form}
        loading={loading}
        handleChange={handleChange}
        handleTextareaKeyDown={handleTextareaKeyDown}
        handleAutoResize={handleAutoResize}
      />
    );
  } catch (e) {
    requiredFieldsError = e;
  }
  try {
    optionalFieldsElem = (
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
    );
  } catch (e) {
    optionalFieldsError = e;
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 p-10 rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md">
          <span className="animate-spin text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mx-auto">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M22 12a10 10 0 0 1-10 10" />
            </svg>
          </span>
          <span className="text-white text-lg font-medium tracking-wide">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 flex items-center justify-center relative ${backgroundClass}`}>
      {/* Top Toolbar */}
      <div className="w-full flex justify-center" style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'none' }}>
        <div className={`mt-4 max-w-5xl w-full rounded-2xl shadow-lg backdrop-blur-md px-6 py-2 flex items-center justify-between relative ${cardClass}`} style={{ minHeight: 40, fontSize: '0.95rem', pointerEvents: 'auto' }}>
          <div className="flex items-center gap-4">
            <SOWListButton />
          </div>
          <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium select-none pointer-events-none flex items-center gap-2 ${textClass}`}>
            <FileText className="h-5 w-5" />
            Statement of Work (SOW) Generator
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </div>
      {/* Prefilled alert */}
      {prefilledFromPrompt && (
        <Alert className="mb-4">
          <AlertDescription>
            Form pre-filled from previous SOW. You can modify and regenerate.
          </AlertDescription>
        </Alert>
      )}
      {/* Card content below toolbar */}
      {!form ? <div>Form state missing!</div> : null}
      <Card
        className={`shadow-2xl p-0 md:p-2 ${cardClass}`}
        style={{ width: cardWidth, minWidth: '400px', maxWidth: '80vw', transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="mt-8" />
        <CardContent className="space-y-8 px-8 pb-10 pt-2">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-2 max-h-[70vh] items-stretch">
              {/* Left column: Required fields */}
              {requiredFieldsError ? (
                <div style={{ color: 'red' }}>Error in RequiredFieldsForm: {String(requiredFieldsError)}</div>
              ) : requiredFieldsElem}

              {/* Separator */}
              <div className="hidden md:flex items-stretch mx-2">
                <Separator orientation="vertical" className={`${theme === 'light' ? 'bg-gray-300' : 'bg-white/20'}`} />
              </div>

              {/* Right column: Optional fields */}
              {optionalFieldsError ? (
                <div style={{ color: 'red' }}>Error in OptionalFieldsSelector: {String(optionalFieldsError)}</div>
              ) : optionalFieldsElem}
            </div>
            {/* Submit button below the columns */}
            <Button
              type="submit"
              disabled={loading || !form.projectDescription.trim()}
              className="w-full bg-linear-to-r from-blue-600 via-blue-700 to-yellow-500 hover:from-blue-700 hover:via-blue-800 hover:to-yellow-600 text-white border-0"
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

