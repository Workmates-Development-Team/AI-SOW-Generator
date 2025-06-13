import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  type: string;
  html: string;
}

interface PresentationData {
  title: string;
  theme: string;
  slides: Slide[];
  totalSlides: number;
}

const PresentationGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  const generatePresentation = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const result = await response.json();
      if (result.success) {
        setPresentation(result.data);
        setCurrentSlide(0);
      }
    } catch (error) {
      console.error('Error generating presentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (presentation && currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Input Section */}
        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Enter your presentation topic..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
            />
            <Button onClick={generatePresentation} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Presentation'}
            </Button>
          </div>
        </Card>

        {/* Presentation Display */}
        {presentation && (
          <div className="space-y-4">
            {/* Slide Counter */}
            <div className="text-center text-gray-600">
              Slide {currentSlide + 1} of {presentation.totalSlides}
            </div>

            {/* Slide Container */}
            <Card className="aspect-video bg-white shadow-lg">
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ 
                  __html: presentation.slides[currentSlide]?.html || '' 
                }}
              />
            </Card>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                onClick={nextSlide}
                disabled={currentSlide === presentation.slides.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Slide Thumbnails */}
            <div className="flex gap-2 justify-center overflow-x-auto py-4">
              {presentation.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-16 h-12 border-2 rounded flex-shrink-0 ${
                    currentSlide === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <span className="text-xs text-gray-600">{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationGenerator;