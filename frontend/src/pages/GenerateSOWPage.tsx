import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { api } from '../lib/api';
import { useAuth } from '../lib/useAuth';
import LogoutButton from "../components/LogoutButton";
import SOWListButton from "../components/SOWListButton";

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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { token, setToken } = useAuth();

  const handleLogout = async () => {
    await api.auth.logout();
    setToken(null);
    navigate('/login');
  };

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

    // Generate SOW number here
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const shortUuid = uuidv4().replace(/\D/g, '').slice(0, 5);
    const sowNumber = `CWM${day}${month}${year}${shortUuid}`;

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
        }),
      });
      const sowResult = await sowResponse.json();
      if (!sowResult.success) {
        setError(sowResult.error || 'Failed to generate SOW document');
        return;
      }
      // Attaching sowNumber and clientName
      const { template, totalSlides, ...sowDataToSave } = sowResult.data;
      const presentationWithSOW = { ...sowDataToSave, sowNumber, clientName: form.clientName.trim() };
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
      {/* Logout and SOW List buttons at top right */}
      <div className="fixed top-4 right-4 z-20 flex flex-row gap-2">
        <SOWListButton />
        <LogoutButton />
      </div>
      <Card
        className="shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md p-0 md:p-2"
        style={{ width: cardWidth, minWidth: '400px', maxWidth: '80vw', transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <CardHeader className="px-8 pt-8 pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            Statement of Work (SOW) Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 px-8 pb-10 pt-2">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-2 max-h-[70vh] items-stretch">
              {/* Left column: Required fields */}
              <div
                className="flex-1 space-y-6 overflow-y-auto min-h-0 pr-10 pr-2"
                style={{ scrollbarGutter: 'stable' }}
              >
                <label htmlFor="clientName" className="block text-sm font-medium text-white/80">
                  Client Name
                </label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="Enter the client's name"
                  value={form.clientName}
                  onChange={handleChange}
                  className="text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 resize-none"
                  disabled={loading}
                  required
                  autoComplete="off"
                  spellCheck={false}
                />
                <label htmlFor="projectDescription" className="block text-sm font-medium text-white/80">
                  Project Description
                </label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe your project for the SOW"
                  value={form.projectDescription}
                  onChange={handleChange}
                  onKeyDown={handleTextareaKeyDown}
                  onInput={handleAutoResize}
                  className="min-h-[80px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={loading}
                  required
                />
                <label htmlFor="requirements" className="block text-sm font-medium text-white/80">
                  Client Requirements
                </label>
                <Textarea
                  id="requirements"
                  placeholder="List any specific client requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  onKeyDown={handleTextareaKeyDown}
                  onInput={handleAutoResize}
                  className="min-h-[80px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={loading}
                />
                <label htmlFor="duration" className="block text-sm font-medium text-white/80">
                  Project Duration
                </label>
                <Textarea
                  id="duration"
                  placeholder="e.g. 3 months, Q1 2025, etc." 
                  value={form.duration}
                  onChange={handleChange}
                  onInput={handleAutoResize}
                  className="min-h-[80px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={loading}
                />
                <label htmlFor="budget" className="block text-sm font-medium text-white/80">
                  Budget
                </label>
                <Textarea
                  id="budget"
                  placeholder="e.g. $10,000, 5 lakh INR, etc."
                  value={form.budget}
                  onChange={handleChange}
                  onInput={handleAutoResize}
                  className="min-h-[80px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={loading}
                />
              </div>

              {/* Separator */}
              <div className="hidden md:flex items-stretch mx-2">
                <Separator orientation="vertical" className="h-full bg-white/20" />
              </div>

              {/* Right column: Optional fields */}
              <div
                className="flex-1 space-y-6 overflow-y-auto min-h-0 pl-10 pl-2 max-h-[70vh]"
                style={{ scrollbarGutter: 'stable' }}
              >
                {addedOptionalFields.map((fieldId) => {
                  const field = optionalFields.find(f => f.id === fieldId);
                  if (!field) return null; // Add this check
                  return (
                    <div key={fieldId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={fieldId} className="text-sm font-medium text-white/80">
                          {field.label}
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOptionalField(fieldId)}
                          className="text-white hover:bg-white/20 focus:bg-white/30 ml-2"
                          aria-label={`Remove ${field.label}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        id={fieldId}
                        placeholder={field.placeholder}
                        value={form[fieldId]}
                        onChange={handleChange}
                        onKeyDown={handleTextareaKeyDown}
                        onInput={handleAutoResize}
                        className="min-h-[80px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 flex-1"
                        disabled={loading}
                      />
                    </div>
                  );
                })}
                {availableOptionalFields.length > 0 && (
                  <div className="space-y-2">
                    <Select onValueChange={handleAddOptionalField}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-white/40">
                        <span className="text-white/50">Add Optional Field</span>
                      </SelectTrigger>
                      <SelectContent className="bg-white/10 border border-white/20 text-white shadow-xl">
                        {availableOptionalFields.map((field) => (
                          <SelectItem key={field.id} value={field.id} className="text-white hover:bg-white/10 focus:bg-white/20">
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
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

