import React, { useEffect, useRef } from 'react';
import { TEMPLATES } from '@/types/template';

interface TemplateApplierProps {
  children: React.ReactNode;
  className?: string;
  templateId?: string;
}

const TemplateApplier: React.FC<TemplateApplierProps> = ({
  children,
  className = "",
  templateId = "plain",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const template = TEMPLATES[templateId as keyof typeof TEMPLATES] || TEMPLATES.plain;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const styles = template.styles;

    // Apply styles to elements with specific IDs
    const applyStyles = (id: string, elementStyles: React.CSSProperties) => {
      const elements = container.querySelectorAll(`#${id}`);
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        Object.assign(htmlElement.style, elementStyles);
      });
    };

    // Apply all template styles
    applyStyles('slide-content', {
      ...styles.slideContent,
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
    });
    applyStyles('slide-title', styles.slideTitle);
    applyStyles('slide-subtitle', styles.slideSubtitle);
    applyStyles('slide-list', styles.slideList);
    applyStyles('slide-table', styles.slideTable);
    applyStyles('slide-quote', styles.slideQuote);
    applyStyles('slide-description', styles.slideDescription);
    applyStyles('slide-highlight', styles.slideHighlight);
    applyStyles('slide-stats', styles.slideStats);
    applyStyles('slide-keypoint', styles.slideKeypoint);
    applyStyles('slide-image', styles.slideImage);
    applyStyles('slide-header', styles.slideHeader);
    applyStyles('slide-footer', styles.slideFooter);

    // Apply table-specific styles
    const tables = container.querySelectorAll('#slide-table');
    tables.forEach((table) => {
      const ths = table.querySelectorAll('th');
      const tds = table.querySelectorAll('td');
      ths.forEach((th) => {
        Object.assign((th as HTMLElement).style, styles.slideTableTh);
      });
      tds.forEach((td) => {
        Object.assign((td as HTMLElement).style, styles.slideTableTd);
      });
    });

    // Apply custom CSS if available
    if (template.customCSS) {
      let styleElement = document.getElementById(`template-${templateId}-styles`);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = `template-${templateId}-styles`;
        styleElement.textContent = template.customCSS;
        document.head.appendChild(styleElement);
      }
    }
  }, [children, templateId]);

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full ${template.backgroundClass || ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default TemplateApplier;