import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const API_URL = import.meta.env.API_URL || 'http://localhost:5000';

export default function GenerateSOWPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const sowResponse = await fetch(`${API_URL}/api/generate-presentation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), documentType: 'sow' }),
      });
      const sowResult = await sowResponse.json();
      if (!sowResult.success) {
        setError(sowResult.error || 'Failed to generate SOW document');
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
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
          <div className="space-y-2">
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-white/80"
            >
              Project Description
            </label>
            <Textarea
              id="prompt"
              placeholder="Describe your project for the SOW (e.g., 'Web app for e-commerce with payment integration...')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-yellow-500 hover:from-blue-700 hover:via-blue-800 hover:to-yellow-600 text-white border-0"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating SOW...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Generate SOW Document
              </>
            )}
          </Button>
          {error && (
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-white">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}