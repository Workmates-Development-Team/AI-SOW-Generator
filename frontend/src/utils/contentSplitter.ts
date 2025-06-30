import type { Slide } from '@/types/presentation';

export interface ContentMeasurement {
  fits: boolean;
  overflowContent?: string;
  fittingContent: string;
}

export class ContentSplitter {
  private static measureContent(
    content: string,
    template: any,
    containerWidth: number = 794,
    containerHeight: number = 1123
  ): ContentMeasurement {
    // Create a temporary container to measure content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = `${containerWidth}px`;
    tempContainer.style.height = `${containerHeight}px`;
    tempContainer.style.visibility = 'hidden';
    
    // Apply template styles
    const contentDiv = document.createElement('div');
    Object.assign(contentDiv.style, {
      ...template.layout.content.position,
      ...template.layout.content.style,
      position: 'absolute',
    });
    
    tempContainer.appendChild(contentDiv);
    document.body.appendChild(tempContainer);

    try {
      // Set content and measure
      contentDiv.innerHTML = this.markdownToHtml(content);
      
      const availableHeight = this.calculateAvailableHeight(template, containerHeight);
      const contentHeight = contentDiv.scrollHeight;
      
      if (contentHeight <= availableHeight) {
        return { fits: true, fittingContent: content };
      }

      // Content overflows, need to split
      const { fittingContent, overflowContent } = this.splitContentToFit(
        content,
        contentDiv,
        availableHeight
      );

      return {
        fits: false,
        fittingContent,
        overflowContent
      };
    } finally {
      document.body.removeChild(tempContainer);
    }
  }

  private static calculateAvailableHeight(template: any, containerHeight: number): number {
    // Calculate available height based on template layout
    const contentPosition = template.layout.content.position;
    const topOffset = this.parsePositionValue(contentPosition.top, containerHeight);
    const bottomOffset = this.parsePositionValue(contentPosition.bottom, containerHeight) || 50;
    
    return containerHeight - topOffset - bottomOffset;
  }

  private static parsePositionValue(value: string | number | undefined, containerSize: number): number {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    
    if (typeof value === 'string') {
      if (value.includes('%')) {
        return (parseFloat(value) / 100) * containerSize;
      }
      if (value.includes('px')) {
        return parseFloat(value);
      }
      if (value.includes('rem')) {
        return parseFloat(value) * 16; // Assuming 1rem = 16px
      }
    }
    
    return 0;
  }

  private static splitContentToFit(
    content: string,
    contentDiv: HTMLElement,
    maxHeight: number
  ): { fittingContent: string; overflowContent: string } {
    const lines = content.split('\n');
    let fittingLines: string[] = [];
    let overflowLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const testContent = [...fittingLines, lines[i]].join('\n');
      contentDiv.innerHTML = this.markdownToHtml(testContent);
      
      if (contentDiv.scrollHeight <= maxHeight) {
        fittingLines.push(lines[i]);
      } else {
        overflowLines = lines.slice(i);
        break;
      }
    }
    
    return {
      fittingContent: fittingLines.join('\n'),
      overflowContent: overflowLines.join('\n')
    };
  }

  private static markdownToHtml(markdown: string): string {
    // Simple markdown to HTML conversion for measurement
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
  }

  static splitSlideContent(slide: Slide, template: any): Slide[] {
    const measurement = this.measureContent(slide.content, template);
    
    if (measurement.fits) {
      return [slide];
    }

    const slides: Slide[] = [
      {
        ...slide,
        content: measurement.fittingContent
      }
    ];

    // Recursively split overflow content
    if (measurement.overflowContent && measurement.overflowContent.trim()) {
      const overflowSlide: Slide = {
        ...slide,
        id: `${slide.id}_overflow_${slides.length}`,
        title: '', // Remove title for continuation pages
        content: measurement.overflowContent
      };

      const additionalSlides = this.splitSlideContent(overflowSlide, template);
      slides.push(...additionalSlides);
    }

    return slides;
  }
}