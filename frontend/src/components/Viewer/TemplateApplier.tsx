import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TEMPLATES } from '@/types/template';
import type { Slide } from '@/types/page';
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

  const customComponents = {
    table: ({ children }: any) => (
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1rem',
        marginBottom: '1.5rem',
        fontSize: '0.92em',
        backgroundColor: 'inherit',
      }}>{children}</table>
    ),
    th: ({ children }: any) => (
      <th style={{
        border: '2px solid #222',
        borderBottomWidth: '3px',
        padding: '8px 10px',
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#111',
        fontSize: '0.98em',
      }}>{children}</th>
    ),
    td: ({ children }: any) => (
      <td style={{
        padding: '7px 10px',
        border: '1px solid #888',
        color: '#222',
        fontSize: '0.92em',
      }}>{children}</td>
    ),
    ul: ({ children }: any) => (
      <ul style={{
        paddingLeft: '1.5rem',
        lineHeight: '1.8',
      }}>{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol style={{
        paddingLeft: '1.5rem',
        lineHeight: '1.8',
      }}>{children}</ol>
    ),
    li: ({ children }: any) => (
      <li style={{
        listStyleType: 'disc',
        marginLeft: '1.2em',
        marginBottom: '0.3em',
      }}>{children}</li>
    ),
    p: ({ children }: any) => (
      <p style={{
        marginBottom: '1rem',
        lineHeight: '1.6',
      }}>{children}</p>
    ),
    h1: ({ children }: any) => (
      <h1 style={{ fontSize: '2.2em', fontWeight: 700, margin: '1.2em 0 0.5em 0' }}>{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 style={{ fontSize: '1.7em', fontWeight: 600, margin: '1em 0 0.5em 0' }}>{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ fontSize: '1.3em', fontWeight: 600, margin: '0.8em 0 0.4em 0' }}>{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: '4px solid #888',
        margin: '1em 0',
        padding: '0.5em 1em',
        color: '#555',
        background: '#f9f9f9',
      }}>{children}</blockquote>
    ),
    code: ({ children, ...props }: any) => (
      <code style={{
        background: '#f4f4f4',
        borderRadius: '4px',
        padding: '2px 6px',
        fontSize: '0.98em',
        color: '#c7254e',
      }} {...props}>{children}</code>
    ),
    pre: ({ children }: any) => (
      <pre style={{
        background: '#222',
        color: '#fff',
        borderRadius: '8px',
        padding: '1em',
        overflowX: 'auto',
        fontSize: '0.98em',
      }}>{children}</pre>
    ),
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 700 }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: 'italic' }}>{children}</em>
    ),
    hr: () => (
      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '2em 0' }} />
    ),
    a: ({ children, href }: any) => (
      <a href={href} style={{ color: '#2563eb', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
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
      {templateId === 'cover' ? (
        <div style={{
          position: 'relative',
          height: '320px',
          ...template.layout.title.position,
        }}>
          <div style={{ ...template.layout.title.style }}>
            {slide.title}
          </div>
          <SOWDateSection sowDate={slide.sowDate} />
          <SOWNumberSection sowNumber={slide.sowNumber || sowNumber} />
        </div>
      ) : (
        <div style={{
          ...template.layout.title.position,
          ...template.layout.title.style,
        }}>
          {slide.title}
        </div>
      )}

      {/* Markdown Content */}
      <div style={{
        ...template.layout.content.position,
        ...Object.fromEntries(Object.entries(template.layout.content.style).filter(([key]) => key !== 'padding')),
      }}>
        <div style={{ padding: template.layout.content.style?.padding || undefined, height: '100%', width: '100%' }}>
          <ReactMarkdown components={customComponents} remarkPlugins={[remarkGfm]}>
            {slide.content.replace(/\\n/g, '\n')}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default TemplateApplier;