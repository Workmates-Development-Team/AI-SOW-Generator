import type { Slide } from '@/types/page';

export interface ContentMeasurement {
  fits: boolean;
  overflowContent?: string;
  fittingContent: string;
  totalLines?: number;
  maxLines?: number;
}

export class ContentSplitter {
  private static readonly MAX_LINES_FIRST_PAGE = 48;
  private static readonly MAX_LINES_OVERFLOW_PAGE = 52;
  
  private static readonly TABLE_LINE_MULTIPLIER = 1.5; // Tables take more space
  private static readonly MIXED_LINE_MULTIPLIER = 1.2; // Mixed content needs more space

  private static measureContent(content: string, maxLines: number, contentType?: string): ContentMeasurement {
    const allLines = content.split('\n');
    const nonEmptyLines = allLines.filter(line => line.trim() !== '');
    
    let adjustedMaxLines = maxLines;
    if (contentType === 'table') {
      adjustedMaxLines = Math.floor(maxLines / this.TABLE_LINE_MULTIPLIER);
    } else if (contentType === 'mixed') {
      adjustedMaxLines = Math.floor(maxLines / this.MIXED_LINE_MULTIPLIER);
    }
    
    let effectiveLineCount = nonEmptyLines.length;
    if (contentType === 'table') {
      const tableLines = nonEmptyLines.filter(line => line.includes('|'));
      const headerRow = tableLines[0];
      if (headerRow) {
        const columnCount = (headerRow.match(/\|/g) || []).length - 1;
        effectiveLineCount = tableLines.length * Math.max(1, columnCount / 3);
      }
    } else {
      let longLinePenalty = 0;
      nonEmptyLines.forEach(line => {
        if (line.length > 80) {
          longLinePenalty += Math.floor(line.length / 80);
        }
      });
      effectiveLineCount += longLinePenalty;
    }
    
    if (effectiveLineCount <= adjustedMaxLines) {
      return {
        fits: true,
        fittingContent: content,
        totalLines: effectiveLineCount,
        maxLines: adjustedMaxLines
      };
    }

    const { fittingContent, overflowContent } = this.splitContentByNonEmptyLines(
      allLines, 
      adjustedMaxLines,
      contentType
    );

    return {
      fits: false,
      fittingContent,
      overflowContent,
      totalLines: effectiveLineCount,
      maxLines: adjustedMaxLines
    };
  }

  private static splitContentByNonEmptyLines(
    allLines: string[], 
    maxNonEmptyLines: number,
    contentType?: string
  ): { fittingContent: string; overflowContent: string } {
    const fittingLines: string[] = [];
    const overflowLines: string[] = [];
    let nonEmptyCount = 0;
    let overflowStarted = false;
    let tableHeaderProcessed = false;

    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];
      
      if (!overflowStarted) {
        if (line.trim() !== '') {
          if (contentType === 'table' && line.includes('|')) {
            if (!tableHeaderProcessed) {
              fittingLines.push(line);
              tableHeaderProcessed = true;
              continue;
            }
            
            const columnCount = (line.match(/\|/g) || []).length - 1;
            const rowWeight = Math.max(1, columnCount / 3);
            
            if (nonEmptyCount + rowWeight >= maxNonEmptyLines) {
              overflowStarted = true;
              overflowLines.push(line);
            } else {
              fittingLines.push(line);
              nonEmptyCount += rowWeight;
            }
          } else {
            if (nonEmptyCount >= maxNonEmptyLines) {
              overflowStarted = true;
              overflowLines.push(line);
            } else {
              fittingLines.push(line);
              nonEmptyCount++;
            }
          }
        } else {
          fittingLines.push(line);
        }
      } else {
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
    isFirstSlide: boolean = true,
    overflowId: number = 0
  ): Slide[] {
    const maxLines = isFirstSlide ? this.MAX_LINES_FIRST_PAGE : this.MAX_LINES_OVERFLOW_PAGE;
    const contentType = slide.contentType || 'text';
    const title = slide.title?.toLowerCase() || '';

    let adjustedMaxLines = maxLines;

    if (title.includes('assumptions and constraints')) {
      adjustedMaxLines = Math.floor(maxLines * (overflowId > 0 ? 0.7 : 0.45));
    } else if (title.includes('acceptance criteria')) {
      adjustedMaxLines = Math.floor(maxLines * (overflowId > 0 ? 0.65 : 0.6));
    } else if (title.includes('objectives')) {
      adjustedMaxLines = Math.floor(maxLines * (overflowId > 0 ? 0.7 : 0.55));
    } else if (title.includes('scope of work')) {
      adjustedMaxLines = Math.floor(maxLines * (overflowId > 0 ? 0.8 : 0.7));
    } else if (title.includes('deliverables')) {
      adjustedMaxLines = Math.floor(maxLines * (overflowId > 0 ? 0.75 : 0.7));
    } else if (title.includes('project terms')) {
      adjustedMaxLines = Math.floor(maxLines * (overflowId > 0 ? 0.75 : 0.6));
    }

    const measurement = this.measureContent(slide.content, adjustedMaxLines, contentType);
    
    console.log(`Slide ${slide.id} (${overflowId === 0 ? 'FIRST' : 'OVERFLOW'}):`, {
      title: slide.title,
      contentType,
      maxLines: adjustedMaxLines,
      totalLines: measurement.totalLines,
      fits: measurement.fits,
      fittingContentLines: measurement.fittingContent.split('\n').filter(l => l.trim() !== '').length,
      overflowId,
    });
    
    if (measurement.fits) {
      return [slide];
    }

    const slides: Slide[] = [];
    
    if (measurement.fittingContent.trim()) {
      slides.push({
        ...slide,
        content: measurement.fittingContent,
        ...(overflowId > 0 ? { overflowId } : {}),
      });
    }

    if (measurement.overflowContent && measurement.overflowContent.trim()) {
      const nextOverflowId = overflowId + 1;
      const overflowSlide: Slide = {
        ...slide,
        id: `${slide.id}_overflow_${Date.now()}`,
        title: '',
        content: measurement.overflowContent,
        template: "plain",
        overflowId: nextOverflowId,
      };

      const additionalSlides = this.splitSlideContent(
        overflowSlide,
        template,
        false,
        nextOverflowId
      );

      slides.push(...additionalSlides);
    }

    return slides;
  }
}