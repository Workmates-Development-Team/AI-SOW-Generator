import React from 'react';
import ReactMarkdown from 'react-markdown';
import { TEMPLATES } from '@/types/template';
import type { Slide } from '@/types/presentation';

interface TemplateApplierProps {
  slide: Slide;
  className?: string;
  templateId?: string;
}

const TemplateApplier: React.FC<TemplateApplierProps> = ({
  slide,
  className = "",
  templateId = "plain",
}) => {
  const actualTemplateId = slide.template || templateId;
  const template = TEMPLATES[actualTemplateId as keyof typeof TEMPLATES] || TEMPLATES.generic;

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
      <ReactMarkdown components={customComponents}>
        {slide.content}
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
      </div>

      {/* Content */}
      <div style={{
        ...template.layout.content.position,
        ...template.layout.content.style,
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default TemplateApplier;