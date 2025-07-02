import type { Slide } from '@/types/presentation';
import { PLAIN_TEMPLATE } from '@/types/template';

export interface ContentMeasurement {
  fits: boolean;
  overflowContent?: string;
  fittingContent: string;
  totalLines?: number;
  maxLines?: number;
}

export class ContentSplitter {
  private static readonly MAX_LINES_FIRST_PAGE = 18;
  private static readonly MAX_LINES_OVERFLOW_PAGE = 28;

  private static measureContent(content: string, maxLines: number): ContentMeasurement {
    const allLines = content.split('\n');
    const nonEmptyLines = allLines.filter(line => line.trim() !== '');
    
    if (nonEmptyLines.length <= maxLines) {
      return {
        fits: true,
        fittingContent: content,
        totalLines: nonEmptyLines.length,
        maxLines
      };
    }

    // Split while preserving structure and respecting the line limit
    const { fittingContent, overflowContent } = this.splitContentByNonEmptyLines(
      allLines, 
      maxLines
    );

    return {
      fits: false,
      fittingContent,
      overflowContent,
      totalLines: nonEmptyLines.length,
      maxLines
    };
  }

  private static splitContentByNonEmptyLines(
    allLines: string[], 
    maxNonEmptyLines: number
  ): { fittingContent: string; overflowContent: string } {
    const fittingLines: string[] = [];
    const overflowLines: string[] = [];
    let nonEmptyCount = 0;
    let overflowStarted = false;

    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];
      
      if (!overflowStarted) {
        // Check if adding this line would exceed the limit
        if (line.trim() !== '') {
          if (nonEmptyCount >= maxNonEmptyLines) {
            // Start overflow from this line
            overflowStarted = true;
            overflowLines.push(line);
          } else {
            fittingLines.push(line);
            nonEmptyCount++;
          }
        } else {
          // Empty line - add to fitting content
          fittingLines.push(line);
        }
      } else {
        // Already in overflow mode
        overflowLines.push(line);
      }
    }

    return {
      fittingContent: fittingLines.join('\n').trim(),
      overflowContent: overflowLines.join('\n').trim()
    };
  }

  static splitSlideContent(
    slide: Slide, 
    template: any, 
    isFirstSlide: boolean = true
  ): Slide[] {
    const maxLines = isFirstSlide ? this.MAX_LINES_FIRST_PAGE : this.MAX_LINES_OVERFLOW_PAGE;
    const measurement = this.measureContent(slide.content, maxLines);
    
    console.log(`Slide ${slide.id} (${isFirstSlide ? 'FIRST' : 'OVERFLOW'}):`, {
      maxLines,
      totalLines: measurement.totalLines,
      fits: measurement.fits,
      fittingContentLines: measurement.fittingContent.split('\n').filter(l => l.trim() !== '').length,
    });
    
    if (measurement.fits) {
      return [slide];
    }

    const slides: Slide[] = [];
    
    if (measurement.fittingContent.trim()) {
      slides.push({
        ...slide,
        content: measurement.fittingContent
      });
    }

    if (measurement.overflowContent && measurement.overflowContent.trim()) {
      const overflowSlide: Slide = {
        ...slide,
        id: `${slide.id}_overflow_${Date.now()}`,
        title: '',
        content: measurement.overflowContent,
        template: "plain",
      };

      const additionalSlides = this.splitSlideContent(
        overflowSlide,
        template,
        false
      );

      slides.push(...additionalSlides);
    }

    return slides;
  }
}