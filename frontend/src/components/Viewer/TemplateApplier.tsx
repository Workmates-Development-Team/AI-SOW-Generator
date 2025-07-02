import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TEMPLATES } from '@/types/template';
import type { Slide } from '@/types/presentation';
import { v4 as uuidv4 } from 'uuid';

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

  // Use the provided sowNumber, or generate one as fallback
  const generatedSowNumber = React.useMemo(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const shortUuid = uuidv4().replace(/-/g, '').slice(0, 5).toUpperCase();
    return `CWM${day}${month}${year}${shortUuid}`;
  }, []);
  const displaySowNumber = sowNumber || generatedSowNumber;

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
        {/* Show date on cover template */}
        {templateId === 'cover' && (() => {
          const date = new Date();
          const locale = 'en-IN';
          const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' };
          const parts = new Intl.DateTimeFormat(locale, options).formatToParts(date);

          const monthPart = parts.find((part) => part.type === 'month');
          const dayPart = parts.find((part) => part.type === 'day');
          const yearPart = parts.find((part) => part.type === 'year');

          return (
            <div
              style={{
                marginTop: '22rem',
                marginRight: '-11rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
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
        ...Object.fromEntries(Object.entries(template.layout.content.style).filter(([key]) => key !== 'padding')),
      }}>
        <div style={{ padding: template.layout.content.style?.padding || undefined, height: '100%', width: '100%' }}>
          {renderContent()}
        </div>
      </div>

      {/* SOW Number using UUID */}
      {templateId === 'cover' && (
        <div
          style={{
            position: 'absolute',
            bottom: '0.2rem',
            right: '0.5rem',
            color: '#1e3a8a',
            fontWeight: 600,
            fontSize: '1.3rem',
            padding: '0.5rem 1.2rem',
            zIndex: 10,
          }}
        >
          SOW Number: {displaySowNumber}
        </div>
      )}
    </div>
  );
};

export default TemplateApplier;