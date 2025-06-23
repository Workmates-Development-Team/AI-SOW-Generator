import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const API_URL = import.meta.env.API_URL || 'http://localhost:5000';

export default function GenerateSOWPage() {
  const [projectDescription, setProjectDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requirements, setRequirements] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [supportService, setSupportService] = useState('');
  const [legalTerms, setLegalTerms] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!projectDescription.trim()) return;
    setLoading(true);
    setError('');
    // Compose a structured prompt for the AI
    const fullPrompt = `Project Description: ${projectDescription.trim()}
Client Requirements: ${requirements.trim()}
Project Duration: ${duration.trim()}
Budget: ${budget.trim()}
Support Service: ${supportService.trim()}
Special Legal Terms: ${legalTerms.trim()}
Deliverables: ${deliverables.trim()}`;
    try {
      const sowResponse = await fetch(`${API_URL}/api/generate-presentation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: 'sow',
          projectDescription: projectDescription.trim(),
          requirements: requirements.trim(),
          duration: duration.trim(),
          budget: budget.trim(),
          supportService: supportService.trim(),
          legalTerms: legalTerms.trim(),
          deliverables: deliverables.trim(),
        }),
      });
      const sowResult = await sowResponse.json();
      if (!sowResult.success) {
        setError(sowResult.error || 'Failed to generate SOW document');
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/presentation', { state: { presentation: sowResult.data } });
    } catch (err) {
      setError(`Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            Statement of Work (SOW) Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <label htmlFor="projectDescription" className="block text-sm font-medium text-white/80">
              Project Description
            </label>
            <Textarea
              id="projectDescription"
              placeholder="Describe your project for the SOW"
              value={projectDescription}
              onChange={e => setProjectDescription(e.target.value)}
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
              value={requirements}
              onChange={e => setRequirements(e.target.value)}
              className="min-h-[60px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              disabled={loading}
            />
            <label htmlFor="duration" className="block text-sm font-medium text-white/80">
              Project Duration
            </label>
            <Input
              id="duration"
              placeholder="e.g. 3 months, Q1 2025, etc."
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              disabled={loading}
            />
            <label htmlFor="budget" className="block text-sm font-medium text-white/80">
              Budget
            </label>
            <Input
              id="budget"
              placeholder="e.g. $10,000, 5 lakh INR, etc."
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              disabled={loading}
            />
            <label htmlFor="supportService" className="block text-sm font-medium text-white/80">
              Support Service (Optional)
            </label>
            <Input
              id="supportService"
              placeholder="e.g. 24/7 support, 1 year maintenance, etc."
              value={supportService}
              onChange={e => setSupportService(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              disabled={loading}
            />
            <label htmlFor="legalTerms" className="block text-sm font-medium text-white/80">
              Special Legal Terms (Optional)
            </label>
            <Textarea
              id="legalTerms"
              placeholder="e.g. NDA, IP ownership, etc."
              value={legalTerms}
              onChange={e => setLegalTerms(e.target.value)}
              className="min-h-[40px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              disabled={loading}
            />
            <label htmlFor="deliverables" className="block text-sm font-medium text-white/80">
              Deliverables (Optional)
            </label>
            <Textarea
              id="deliverables"
              placeholder="List any specific deliverables"
              value={deliverables}
              onChange={e => setDeliverables(e.target.value)}
              className="min-h-[40px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !projectDescription.trim()}
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