import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.API_URL || 'http://localhost:5000';

export default function GenerateSOWPage() {
  const [form, setForm] = useState({
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  // Resize handler for textareas
  const handleAutoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  // Enter to submit
  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      let form = e.target.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.projectDescription.trim()) return;
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
      const presentationWithSOW = { ...sowResult.data, sowNumber, clientName: form.clientName.trim() };
      navigate('/presentation', { state: { presentation: presentationWithSOW } });
    } catch (err) {
      setError(`Error: ${err.message || err}`);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 flex items-center justify-center">
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
            <div className="flex flex-col md:flex-row gap-16">
              {/* Left column: Required fields */}
              <div className="flex-1 space-y-6">
                <label htmlFor="clientName" className="block text-sm font-medium text-white/80">
                  Client Name
                </label>
                <Textarea
                  id="clientName"
                  placeholder="Enter the client's name"
                  value={form.clientName}
                  onChange={handleChange}
                  onKeyDown={handleTextareaKeyDown}
                  onInput={handleAutoResize}
                  className="min-h-[40px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={loading}
                  required
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
              <div className="flex-1 space-y-6">
                <label htmlFor="deliverables" className="block text-sm font-medium text-white/80">
                  Instructions for the deliverables (Optional)
                </label>
                <Textarea
                  id="deliverables"
                  placeholder="Provide instructions or notes for the deliverables (optional)"
                  value={form.deliverables}
                  onChange={handleChange}
                  onKeyDown={handleTextareaKeyDown}
                  onInput={handleAutoResize}
                  className="min-h-[80px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={loading}
                />
                <label htmlFor="supportService" className="block text-sm font-medium text-white/80">
                  Support Service (Optional)
                </label>
                <Textarea
                  id="supportService"
                  placeholder="e.g. 24/7 support, 1 year maintenance, etc."
                  value={form.supportService}
                  onChange={handleChange}
                  onInput={handleAutoResize}
                  className="min-h-[80px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={loading}
                />
                <label htmlFor="legalTerms" className="block text-sm font-medium text-white/80">
                  Special Legal Terms (Optional)
                </label>
                <Textarea
                  id="legalTerms"
                  placeholder="e.g. NDA, IP ownership, etc."
                  value={form.legalTerms}
                  onChange={handleChange}
                  onKeyDown={handleTextareaKeyDown}
                  onInput={handleAutoResize}
                  className="min-h-[80px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={loading}
                />
                <label htmlFor="terminationClause" className="block text-sm font-medium text-white/80">
                  Termination Clause (Optional)
                </label>
                <Textarea
                  id="terminationClause"
                  placeholder="Describe any termination conditions or clauses (optional)"
                  value={form.terminationClause}
                  onChange={handleChange}
                  onKeyDown={handleTextareaKeyDown}
                  onInput={handleAutoResize}
                  className="min-h-[80px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  disabled={loading}
                />
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