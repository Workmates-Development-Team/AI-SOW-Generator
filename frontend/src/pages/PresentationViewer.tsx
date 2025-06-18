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
  SkipForward
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
  
  const { currentTemplate, changeTemplate } = useTemplate('modern-dark');

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
      
      const scrollLeft = thumbnailContainer.scrollLeft;
      const containerLeft = containerRect.left;
      const thumbnailLeft = thumbnailRect.left;
      const thumbnailWidth = thumbnailRect.width;
      
      // Calculate if the current thumbnail is outside the visible area
      if (thumbnailLeft < containerLeft || thumbnailLeft + thumbnailWidth > containerLeft + containerRect.width) {
        const newScrollLeft = scrollLeft + (thumbnailLeft - containerLeft) - (containerRect.width / 2) + (thumbnailWidth / 2);
        thumbnailContainer.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentSlide]);

  if (!presentationState) {
    navigate('/');
    return null;
  }

  const nextSlide = () => {
    if (currentSlide < presentationState.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
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
        : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4'
    }`}>
      <div className={`${isFullscreen ? 'h-screen' : 'max-w-7xl mx-auto'}`}>
        {/* Header Controls */}
        {showControls && !isFullscreen && (
          <div className="flex items-center justify-between mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
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
        {showControls && (
          <div className="text-center mb-6">
            <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20">
              <span className="text-white text-lg font-medium">
                {currentSlide + 1} of {presentationState.totalSlides}
              </span>
            </div>
          </div>
        )}

        {/* Slide Display */}
        <div className="space-y-6">
          <Card className={`
            ${isFullscreen ? 'h-screen w-screen rounded-none' : 'aspect-video rounded-2xl'}
            shadow-2xl overflow-hidden transition-all duration-300
          `}>
            {renderSlideContent(presentationState.slides[currentSlide])}
            
            {/* Slide transition overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>
          </Card>

          {/* Navigation Controls */}
          {showControls && (
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentSlide(0)}
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
                onClick={() => setCurrentSlide(presentationState.slides.length - 1)}
                disabled={currentSlide === presentationState.slides.length - 1}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Slide Thumbnails */}
          {showControls && !isFullscreen && (
            <div className="w-full overflow-hidden">
              <div className="slide-thumbnails-container flex gap-3 justify-start overflow-x-auto py-6 px-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <div className="flex gap-3 min-w-max">
                  {presentationState.slides.map((slide, index) => (
                    <button
                      key={index}
                      data-slide-index={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`
                        w-20 h-14 border-2 rounded-xl flex-shrink-0 transition-all duration-300
                        ${currentSlide === index
                          ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25 scale-110'
                          : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                        }
                        backdrop-blur-sm relative
                      `}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{index + 1}</span>
                        {slide.type === 'chart' && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        {(slide as HtmlSlide).html?.includes('id="slide-table"') && (
                          <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

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
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <span className="text-white text-sm">
              {currentSlide + 1} / {presentationState.totalSlides}
            </span>
            
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