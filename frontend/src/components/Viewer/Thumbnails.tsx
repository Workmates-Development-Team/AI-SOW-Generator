import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import TemplateApplier from './TemplateApplier';
import type { Slide } from '@/types/page';

interface ThumbnailsProps {
  slides: Slide[];
  currentSlide: number;
  onSelect: (index: number) => void;
  theme: string;
  maxHeightClass?: string;
}

const Thumbnails: React.FC<ThumbnailsProps> = ({ slides, currentSlide, onSelect, theme, maxHeightClass = 'max-h-[70vh]' }) => {
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeThumb = thumbnailRefs.current[currentSlide];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [currentSlide]);

  return (
    <div className={`w-40 flex flex-col gap-5 overflow-y-auto overflow-x-hidden scrollbar-hide ${maxHeightClass} px-1 pt-2`}>
      {slides.map((slide, index) => (
        <button
          key={index}
          data-slide-index={index}
          ref={el => { thumbnailRefs.current[index] = el; }}
          onClick={() => onSelect(index)}
          className={`ml-2 w-28 h-40 border-2 rounded-xl flex-shrink-0 transition-all duration-300
            ${index === 0 ? 'mt-4' : ''} ${index === slides.length - 1 ? 'mb-4' : ''}
            ${currentSlide === index
              ? (theme === 'light' 
                  ? 'border-blue-700 shadow-lg shadow-blue-200 scale-110 ring-4 ring-blue-400 ring-offset-2 ring-offset-white' 
                  : 'border-blue-900 shadow-lg shadow-blue-900/40 scale-110 ring-4 ring-blue-700 ring-offset-2 ring-offset-[#10192b]')
              : (theme === 'light' 
                  ? 'border-gray-300 hover:border-gray-400' 
                  : 'border-white/20 hover:border-white/40')
            }
            bg-transparent backdrop-blur-sm relative overflow-visible p-0 rounded-xl`}
          style={{ background: 'none' }}
        >
          <Card className="w-full h-full rounded-xl overflow-hidden relative p-0 border-0 bg-transparent">
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 794,
              height: 1123,
              transform: 'scale(0.14)',
              transformOrigin: 'top left',
              pointerEvents: 'none',
              zIndex: 1,
              overflow: 'visible',
            }}>
              <TemplateApplier
                slide={slide}
                className="w-[794px] h-[1123px] text-left"
                templateId={typeof slide.template === 'string' ? slide.template : 'plain'}
              />
            </div>
            <div className="w-full h-full flex items-center justify-center relative z-10 pointer-events-none">
              <span
                className={`font-bold text-lg rounded-full px-3 py-1 shadow-md border-2
                  ${currentSlide === index
                    ? (theme === 'light'
                        ? 'bg-yellow-400 text-blue-900 border-yellow-500'
                        : 'bg-yellow-300 text-blue-900 border-yellow-400')
                    : (theme === 'light'
                        ? 'bg-white/80 text-black border-gray-300'
                        : 'bg-white/20 text-black border-white/30')
                  }
                `}
                style={{ minWidth: 32, minHeight: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {index + 1}
              </span>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
};

export default Thumbnails; 