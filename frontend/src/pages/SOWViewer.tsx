import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TemplateApplier from '@/components/Viewer/TemplateApplier';
import { useTemplate } from '@/hooks/useTemplate';
import { PLAIN_TEMPLATE } from '@/types/template';
import type { PresentationData, Slide, HtmlSlide } from '@/types/presentation';
import DownloadPDFButton from '@/components/Viewer/DownloadPDFButton';

const DocumentViewer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const presentation: PresentationData | undefined = location.state?.presentation;

  const [presentationState, setPresentation] = useState<PresentationData | undefined>(presentation);
  const [currentSlide, setCurrentSlide] = useState(0);

  // keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!presentationState) return;
      if (e.key === 'ArrowUp') {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowDown') {
        setCurrentSlide((prev) => (prev < presentationState.slides.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(0);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide(presentationState.slides.length - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationState]);

  if (!presentationState) {
    navigate('/');
    return null;
  }

  const renderSlideContent = (slide: Slide) => {
    const template = PLAIN_TEMPLATE;
    const textColor = template.styles.slideContent.color || 'black';
    const htmlSlide = slide as HtmlSlide;
    return (
      <TemplateApplier className="w-full h-full">
        <div
          className="w-full h-full flex flex-col justify-center"
          dangerouslySetInnerHTML={{
            __html: htmlSlide.html || 
              '<div id="slide-content"><p id="slide-description">No content available</p></div>',
          }}
        />
      </TemplateApplier>
    );
  };

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-0 flex flex-row h-screen w-screen overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full py-4 pl-6">
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh] px-1 pt-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {presentationState.slides.map((slide, index) => (
            <button
              key={index}
              data-slide-index={index}
              onClick={() => setCurrentSlide(index)}
              className={
                `w-14 h-20 border-2 rounded-xl flex-shrink-0 transition-all duration-300
                ${currentSlide === index
                  ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25 scale-110'
                  : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                }
                backdrop-blur-sm relative`
              }
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-base text-white font-medium">{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col h-full relative">
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-full max-w-7xl h-full flex flex-col pt-3">
          <div className="relative flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/20 flex-shrink-0" style={{ minHeight: 40, fontSize: '0.95rem' }}>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                ← Back to Generator
              </Button>
            </div>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 text-sm font-medium select-none pointer-events-none bg-white/10 border border-white/20 px-4 py-1 rounded-full shadow-sm">
              Page {currentSlide + 1} of {presentationState.slides.length}
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <DownloadPDFButton slides={presentationState.slides} title={presentationState.title || 'Presentation'} />
            </div>
          </div>
          {/* Main Slide Area (centered) */}
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="flex items-center justify-center w-full h-full">
              <div
                id={`slide-${currentSlide}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '794px', // A4 width at 96dpi
                  height: '1123px', // A4 height at 96dpi
                  aspectRatio: '210/297',
                }}
              >
                <Card
                  className="w-full h-full rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex items-stretch"
                >
                  {renderSlideContent(presentationState.slides[currentSlide])}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: '-99999px', top: 0 }} id="all-slides-export-container">
        {presentationState.slides.map((slide, idx) => (
          <div key={idx} className="slide-content-export" style={{ width: '794px', height: '1123px' }}>
            {renderSlideContent(slide)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentViewer;