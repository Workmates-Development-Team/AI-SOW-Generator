import "./index.css";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Loader2, 
  FileText, 
  Sparkles,
  CheckCircle,
  AlertCircle 
} from "lucide-react";

interface GenerationResult {
  success: boolean;
  filename: string;
  download_url: string;
  title: string;
  slide_count: number;
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-ppt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to generate presentation');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      window.open(`http://localhost:5000${result.download_url}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI PowerPoint Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Transform your ideas into professional presentations with AI
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Describe Your Presentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Textarea
                placeholder="e.g., Create a presentation about renewable energy with 5 slides covering solar power, wind energy, hydroelectric power, environmental benefits, and future outlook for sustainable energy"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] text-base"
                disabled={loading}
              />
              <div className="mt-2 text-sm text-gray-500">
                Be specific about your topic, number of slides, and key points you want to cover.
              </div>
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !prompt.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Presentation...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate PowerPoint
                </>
              )}
            </Button>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {result && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          Presentation Generated Successfully!
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-green-700 font-medium">
                          {result.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {result.slide_count} slides
                          </Badge>
                          <Badge variant="secondary">
                            {result.filename}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={handleDownload}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PPT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Powered by AWS Bedrock • Built with Flask & React</p>
        </div>
      </div>
    </div>
  );
}

export default App;