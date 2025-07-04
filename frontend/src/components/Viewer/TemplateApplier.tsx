import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TEMPLATES } from '@/types/template';
import type { Slide } from '@/types/presentation';
import { SOWDateSection } from './SOWDateSection';
import { SOWNumberSection } from './SOWNumberSection';

interface TemplateApplierProps {
  slide: Slide;
  className?: string;
  templateId?: string;
  sowNumber?: string;
}

const TemplateApplier: React.FC<TemplateApplierProps> = ({
  slide,
  className = "",
  templateId = "plain",
  sowNumber,
}) => {
  let template;
  if (typeof slide.template === 'string') {
    template = TEMPLATES[slide.template as keyof typeof TEMPLATES] || TEMPLATES.generic;
  } else if (slide.template && typeof slide.template === 'object') {
    template = slide.template;
  } else {
    template = TEMPLATES[templateId as keyof typeof TEMPLATES] || TEMPLATES.generic;
  }

  const renderContent = () => {
    const customComponents = {
      table: ({ children }: any) => (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem',
          fontSize: 'inherit',
          backgroundColor: 'inherit',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          {children}
        </table>
      ),
      th: ({ children }: any) => (
        <th style={{
          backgroundColor: '#1e3a8a',
          color: '#fbbf24',
          padding: '12px',
          textAlign: 'left',
          fontWeight: 'bold',
        }}>
          {children}
        </th>
      ),
      td: ({ children }: any) => (
        <td style={{
          padding: '10px 12px',
          borderBottom: '1px solid #ddd',
          color: '#000',
        }}>
          {children}
        </td>
      ),
      ul: ({ children }: any) => (
        <ul style={{
          paddingLeft: '1.5rem',
          lineHeight: '1.8',
        }}>
          {children}
        </ul>
      ),
      ol: ({ children }: any) => (
        <ol style={{
          paddingLeft: '1.5rem',
          lineHeight: '1.8',
        }}>
          {children}
        </ol>
      ),
      li: ({ children }: any) => (
        <li style={{
          listStyleType: 'disc',
          marginLeft: '1.2em',
          marginBottom: '0.3em',
        }}>
          {children}
        </li>
      ),
      p: ({ children }: any) => (
        <p style={{
          marginBottom: '1rem',
          lineHeight: '1.6',
        }}>
          {children}
        </p>
      ),
    };

    return (
      <ReactMarkdown components={customComponents} remarkPlugins={[remarkGfm]}>
        {slide.content.replace(/\\n/g, '\n')}
      </ReactMarkdown>
    );
  };

  return (
    <div 
      className={`w-full h-full ${className}`}
      style={
        template.backgroundImage
          ? {
              backgroundImage: `url(${template.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
            }
          : { backgroundColor: '#ffffff' }
      }
    >
      {/* Title */}
      <div style={{
        ...template.layout.title.position,
        ...template.layout.title.style,
      }}>
        {slide.title}
        {/* Show SOW number and date as sections on cover template */}
        {templateId === 'cover' && (
          <>
            <SOWDateSection sowDate={slide.sowDate} />
            <SOWNumberSection sowNumber={slide.sowNumber || sowNumber} />
          </>
        )}
      </div>

      {/* Content */}
      <div style={{
        ...template.layout.content.position,
        ...Object.fromEntries(Object.entries(template.layout.content.style).filter(([key]) => key !== 'padding')),
      }}>
        <div style={{ padding: template.layout.content.style?.padding || undefined, height: '100%', width: '100%' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TemplateApplier;