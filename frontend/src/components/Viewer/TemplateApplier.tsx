import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
        {/* Show date only for cover template */}
        {actualTemplateId === 'cover' && (() => {
          const date = new Date();
          const locale = undefined;
          const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
          const parts = new Intl.DateTimeFormat(locale, options).formatToParts(date);

          const monthPart = parts.find((part) => part.type === 'month');
          const dayPart = parts.find((part) => part.type === 'day');
          const yearPart = parts.find((part) => part.type === 'year');

          return (
            <div
              style={{
                marginTop: '19rem',
                marginRight: '-10rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                opacity: 0.85,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                {monthPart && (
                  <span
                    style={{
                      fontSize: '1.4rem',
                      color: 'red',
                      fontWeight: 400,
                      marginRight: '0.15rem',
                      lineHeight: 1,
                    }}
                  >
                    {monthPart.value}
                  </span>
                )}
                {dayPart && (
                  <span
                    style={{
                      fontSize: '1.4rem',
                      color: 'red',
                      fontWeight: 400,
                      marginRight: '0.15rem',
                      lineHeight: 1,
                    }}
                  >
                    {dayPart.value}
                  </span>
                )}
              </div>
              {yearPart && (
                <span
                  style={{
                    fontSize: '3.5rem',
                    fontWeight: 700,
                    color: '#000',
                    lineHeight: 1,
                  }}
                >
                  {yearPart.value}
                </span>
              )}
            </div>
          );
        })()}
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