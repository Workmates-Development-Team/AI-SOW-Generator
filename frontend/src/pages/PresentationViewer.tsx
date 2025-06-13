import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';

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

const PresentationViewer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const presentation: PresentationData | undefined = location.state?.presentation;

  const [currentSlide, setCurrentSlide] = useState(0);

  if (!presentation) {
    // If no presentation data, redirect back to generate page
    navigate('/');
    return null;
  }

  const nextSlide = () => {
    if (currentSlide < presentation.slides.length - 1) {
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{presentation.title}</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </div>
        <div className="space-y-4">
          <div className="text-center text-gray-600">
            Slide {currentSlide + 1} of {presentation.totalSlides}
          </div>
          <Card className="aspect-video bg-white shadow-lg">
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{
                __html: presentation.slides[currentSlide]?.html || '',
              }}
            />
          </Card>
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
      </div>
    </div>
  );
};

export default PresentationViewer;