import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TemplateApplier from '@/components/Viewer/TemplateApplier';
import { TEMPLATES } from '@/types/template';
import type { SOWData, Slide, HtmlSlide } from '@/types/presentation';
import DownloadPDFButton from '@/components/Viewer/DownloadPDFButton';

const SOWViewer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const presentation: SOWData | undefined = location.state?.presentation;

  const [presentationState, setPresentation] = useState<SOWData | undefined>(presentation);
  const [currentSlide, setCurrentSlide] = useState(0);

  const getTemplateId = () => {
    if (!presentationState) return 'plain';
    return presentationState.template || 'plain';
  };

  const templateId = getTemplateId();

  const renderSlideContent = (slide: Slide) => {
    const htmlSlide = slide as HtmlSlide;
    const slideTemplate = slide.template || 'generic';
    
    return (
      <TemplateApplier 
        className="w-full h-full" 
        templateId={templateId} 
        slideTemplate={slideTemplate}
      >
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!presentationState) return;
      if (e.key === 'ArrowUp') {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowDown') {
        setCurrentSlide((prev) => (prev < presentationState.slides.length + 5 - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(0);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide(presentationState.slides.length + 5 - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationState]);

  if (!presentationState) {
    navigate('/');
    return null;
  }

  // Dynamic background
  const getBackgroundClass = () => {
    return 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900';
  };

  // Define appended image numbers for image-only slides (6.svg to 10.svg)
  const appendedImages = [6, 7, 8, 9, 10];

  // Filter out the Termination slide if the user did not fill the field
  const filteredSlides = presentationState?.slides.filter(slide => {
    const htmlSlide = slide as HtmlSlide;
    if (
      slide.template === 'generic' &&
      htmlSlide.html &&
      /<h1[^>]*id=["']slide-title["'][^>]*>\s*Termination\s*<\/h1>/i.test(htmlSlide.html)
    ) {
      // Try to detect if the slide has meaningful content (not just the title)
      const descMatch = htmlSlide.html.match(/<div[^>]*id=["']slide-description["'][^>]*>([\s\S]*?)<\/div>/i);
      if (descMatch && descMatch[1].replace(/<[^>]+>/g, '').trim().length === 0) {
        return false; // Hide if no description content
      }
    }
    return true;
  }) || [];

  const totalSlides = filteredSlides.length + appendedImages.length;

  return (
    <div className={`min-h-screen transition-all duration-300 ${getBackgroundClass()} p-6 h-screen w-screen overflow-hidden relative`}>
      {/* Top Toolbar */}
      <div className="w-full flex justify-center" style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'none' }}>
        <div className="mt-4 max-w-5xl w-full rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 flex items-center justify-between relative" style={{ minHeight: 40, fontSize: '0.95rem', pointerEvents: 'auto' }}>
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
            Page {currentSlide + 1} of {totalSlides}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <DownloadPDFButton slides={presentationState.slides} title={presentationState.title || 'Presentation'} />
          </div>
        </div>
      </div>

      {/* Sidebar Thumbnails */}
      <div className="fixed left-0 top-0 h-full flex flex-col items-center justify-center py-8 pl-8 pr-4 z-10" style={{ width: 80, paddingTop: 80 }}>
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh] px-1 pt-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {[
            ...filteredSlides.map((_, index) => index),
            ...appendedImages.map((_, i) => filteredSlides.length + i)
          ].map((index) => (
            <button
              key={index}
              data-slide-index={index}
              onClick={() => setCurrentSlide(index)}
              className={
                `w-14 h-20 border-2 rounded-xl flex-shrink-0 transition-all duration-300
                ${currentSlide === index
                  ? 'border-blue-900 bg-blue-900/80 shadow-lg shadow-blue-900/40 scale-110'
                  : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                }
                backdrop-blur-sm relative`
              }
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className={`text-base font-medium ${currentSlide === index ? 'text-yellow-400' : 'text-white'}`}>{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="flex-1 flex flex-col h-full relative py-8 pr-8 pl-4 items-center justify-center" style={{ paddingTop: 80, paddingLeft: 96 }}>
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-full max-w-7xl h-full flex flex-col pt-16">
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="flex items-center justify-center w-full h-full">
              <div
                id={`slide-${currentSlide}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '794px',
                  height: '1123px',
                  aspectRatio: '210/297',
                }}
              >
                <Card className="w-full h-full rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex items-stretch bg-transparent border-0">
                  {currentSlide < filteredSlides.length ? (
                    renderSlideContent(filteredSlides[currentSlide])
                  ) : (
                    <img
                      src={`/${appendedImages[currentSlide - filteredSlides.length]}.svg`}
                      alt={`Slide Image ${appendedImages[currentSlide - filteredSlides.length]}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export container for PDF */}
      <div style={{ position: 'absolute', left: '-99999px', top: 0 }} id="all-slides-export-container">
        {filteredSlides.map((slide, idx) => (
          <div key={idx} className="slide-content-export" style={{ width: '794px', height: '1123px' }}>
            {renderSlideContent(slide)}
          </div>
        ))}
        {appendedImages.map((imgNum) => (
          <div key={imgNum} className="slide-content-export" style={{ width: '794px', height: '1123px' }}>
            <img
              src={`/${imgNum}.svg`}
              alt={`Slide Image ${imgNum}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOWViewer;