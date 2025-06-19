import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pencil, 
  Play, 
  Pause,
  Maximize,
  SkipBack,
  SkipForward,
  Trash
} from 'lucide-react';
import DownloadPPTXButton from '@/components/Viewer/DownloadPPTXButton';
import ChartRenderer from '@/components/Charts/ChartRenderer';
import TemplateApplier from '@/components/Viewer/TemplateApplier';
import TemplateSelector from '@/components/Viewer/TemplateSelector';
import { useTemplate } from '@/hooks/useTemplate';
import { AVAILABLE_TEMPLATES } from '@/types/template';
import type { PresentationData, Slide, HtmlSlide, ChartSlide } from '@/types/presentation';

const PresentationViewer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const presentation: PresentationData | undefined = location.state?.presentation;

  const [presentationState, setPresentation] = useState<PresentationData | undefined>(presentation);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const { currentTemplate, changeTemplate } = useTemplate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentSlide < presentationState!.slides.length - 1) {
      interval = setInterval(() => {
        setCurrentSlide(prev => prev + 1);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, presentationState]);

  useEffect(() => {
    if (isPlaying && currentSlide === presentationState!.slides.length - 1) {
      setIsPlaying(false);
    }
  }, [currentSlide, presentationState, isPlaying]);

  // Auto-scroll to current slide in thumbnails
  useEffect(() => {
    const thumbnailContainer = document.querySelector('.slide-thumbnails-container');
    const currentThumbnail = document.querySelector(`[data-slide-index="${currentSlide}"]`);
    
    if (thumbnailContainer && currentThumbnail) {
      const containerRect = thumbnailContainer.getBoundingClientRect();
      const thumbnailRect = currentThumbnail.getBoundingClientRect();
      
      // Calculate the position of the current thumbnail relative to the container
      const thumbnailLeft = thumbnailRect.left - containerRect.left;
      const thumbnailRight = thumbnailLeft + thumbnailRect.width;
      
      // Check if the thumbnail is outside the visible area
      const isOutsideLeft = thumbnailLeft < 0;
      const isOutsideRight = thumbnailRight > containerRect.width;
      
      if (isOutsideLeft || isOutsideRight) {
        // Calculate the target scroll position to center the thumbnail
        const targetScrollLeft = thumbnailContainer.scrollLeft + thumbnailLeft - (containerRect.width / 2) + (thumbnailRect.width / 2);
        
        // Ensure we don't scroll beyond the bounds
        const maxScrollLeft = thumbnailContainer.scrollWidth - containerRect.width;
        const clampedScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));
        
        thumbnailContainer.scrollTo({
          left: clampedScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        prevSlide();
      } else if (e.key === 'ArrowDown') {
        nextSlide();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        if (!isFullscreen) {
          document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } else if (e.key === 'ArrowLeft') {
        skipToFirstSlide();
      } else if (e.key === 'ArrowRight') {
        skipToLastSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, presentationState, isFullscreen]);

  if (!presentationState) {
    navigate('/');
    return null;
  }

  const nextSlide = () => {
    if (currentSlide < presentationState.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      const slideElement = document.getElementById(`slide-${currentSlide + 1}`);
      if (slideElement) {
        slideElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      const slideElement = document.getElementById(`slide-${currentSlide - 1}`);
      if (slideElement) {
        slideElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToFirstSlide = () => {
    setCurrentSlide(0);
    const slideElement = document.getElementById('slide-0');
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const skipToLastSlide = () => {
    setCurrentSlide(presentationState.slides.length - 1);
    const slideElement = document.getElementById(`slide-${presentationState.slides.length - 1}`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const deleteCurrentSlide = () => {
    if (!presentationState || presentationState.slides.length === 1) return;
    const newSlides = presentationState.slides.filter((_, idx) => idx !== currentSlide);
    let newCurrent = currentSlide;
    if (currentSlide >= newSlides.length) {
      newCurrent = newSlides.length - 1;
    }
    setPresentation({ ...presentationState, slides: newSlides });
    setCurrentSlide(newCurrent);
  };

  const renderSlideContent = (slide: Slide) => {
    const template = AVAILABLE_TEMPLATES.find(t => t.id === currentTemplate);
    const textColor = template?.styles.slideContent.color || 'white';
    
    if (slide.type === 'chart') {
      const chartSlide = slide as ChartSlide;
      return (
        <TemplateApplier templateId={currentTemplate} className="w-full h-full">
          <div id="slide-content" className="w-full h-full flex items-center justify-center">
            <ChartRenderer 
              chartConfig={chartSlide.chartConfig}
              className="w-full h-full"
              textColor={textColor}
            />
          </div>
        </TemplateApplier>
      );
    } else {
      const htmlSlide = slide as HtmlSlide;
      return (
        <TemplateApplier templateId={currentTemplate} className="w-full h-full">
          <div
            className="w-full h-full flex flex-col justify-center"
            dangerouslySetInnerHTML={{
              __html: htmlSlide.html || 
                '<div id="slide-content"><p id="slide-description">No content available</p></div>',
            }}
          />
        </TemplateApplier>
      );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isFullscreen 
        ? 'bg-black p-0' 
        : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-0'
    }`} style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh' }}>
      <div className={`${isFullscreen ? 'h-screen w-screen flex flex-col' : 'max-w-7xl mx-auto h-full flex flex-col pt-3'}`} style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh' }}>
        {/* Header Controls */}
        {showControls && !isFullscreen && (
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/20 flex-shrink-0" style={{ minHeight: 40, fontSize: '0.95rem' }}>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                ← Back to Generator
              </Button>
              <DownloadPPTXButton 
                slides={presentationState.slides} 
                title={presentationState.title} 
              />
            </div>
            <div className="flex items-center gap-4">
              <TemplateSelector
                selectedTemplate={currentTemplate}
                onTemplateChange={changeTemplate}
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={togglePlayback}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <><Pause className="w-4 h-4 mr-2" />Pause</>
                  ) : (
                    <><Play className="w-4 h-4 mr-2" />Play</>
                  )}
                </Button>
                <Button
                  onClick={toggleFullscreen}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Maximize className="w-4 h-4 mr-2" />
                  Fullscreen
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Slide Counter */}
        {showControls && !isFullscreen && (
          <></>
        )}
        {/* Slides Area (scrollable, fills available space) */}
        {!isFullscreen && (
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto mt-3" style={{ maxHeight: 'calc(100vh - 40px - 28px - 48px - 56px)' }}>
            {presentationState.slides.map((slide, idx) => (
              <div key={idx} id={`slide-${idx}`} className="w-full max-w-[90vw] mx-auto aspect-video flex-shrink-0">
                <Card
                  className="w-full h-full rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex items-stretch"
                >
                  {renderSlideContent(slide)}
                </Card>
              </div>
            ))}
          </div>
        )}
        {/* Navigation Controls (below slides) */}
        {showControls && !isFullscreen && (
          <div className="relative flex items-center mt-3 pt-8 flex-shrink-0" style={{ minHeight: 36, fontSize: '0.95rem' }}>
            {/* Centered navigation buttons */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
              <Button
                variant="outline"
                onClick={skipToFirstSlide}
                disabled={currentSlide === 0}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={nextSlide}
                disabled={currentSlide === presentationState.slides.length - 1}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={skipToLastSlide}
                disabled={currentSlide === presentationState.slides.length - 1}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            {/* Right-aligned delete button, vertically centered */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Button
                variant="destructive"
                onClick={deleteCurrentSlide}
                disabled={presentationState.slides.length === 1}
                className="bg-red-600/80 border-red-600/40 text-white hover:bg-red-700/90"
                title="Delete current slide"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
        {/* Slide Thumbnails (horizontal, below slides) */}
        {showControls && !isFullscreen && (
          <div className="w-full overflow-hidden flex-shrink-0" style={{ minHeight: 40 }}>
            <div className="slide-thumbnails-container flex gap-3 overflow-x-auto py-6 px-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <div className="flex gap-3 min-w-max mx-auto">
                {presentationState.slides.map((slide, index) => (
                  <button
                    key={index}
                    data-slide-index={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      const slideElement = document.getElementById(`slide-${index}`);
                      if (slideElement) {
                        slideElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className={
                      `w-20 h-14 border-2 rounded-xl flex-shrink-0 transition-all duration-300
                      ${currentSlide === index
                        ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25 scale-110'
                        : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                      }
                      backdrop-blur-sm relative`
                    }
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{index + 1}</span>
                      {slide.type === 'chart' && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {(slide as HtmlSlide).html?.includes('id=\"slide-table\"') && (
                        <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Single Slide (fullscreen mode) */}
        {isFullscreen && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-[98vw] h-full flex items-center justify-center">
              <Card className="w-full h-full rounded-none bg-black flex items-center justify-center aspect-video">
                {renderSlideContent(presentationState.slides[currentSlide])}
              </Card>
            </div>
          </div>
        )}
        {/* Fullscreen Controls */}
        {isFullscreen && (
          <div 
            className={`
              fixed bottom-4 left-1/2 transform -translate-x-1/2 
              flex items-center gap-4 bg-black/50 backdrop-blur-md rounded-full px-6 py-3
              transition-opacity duration-300
              ${showControls ? 'opacity-100' : 'opacity-0'}
            `}
            onMouseEnter={() => setShowControls(true)}
          >
            <Button
              variant="ghost"
              onClick={skipToFirstSlide}
              disabled={currentSlide === 0}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={nextSlide}
              disabled={currentSlide === presentationState.slides.length - 1}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={skipToLastSlide}
              disabled={currentSlide === presentationState.slides.length - 1}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              Exit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationViewer;