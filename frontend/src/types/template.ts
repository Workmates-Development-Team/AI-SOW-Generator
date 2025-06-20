export interface TemplateStyles {
  slideContent: React.CSSProperties;
  slideTitle: React.CSSProperties;
  slideSubtitle: React.CSSProperties;
  slideList: React.CSSProperties;
  slideTable: React.CSSProperties;
  slideTableTh: React.CSSProperties;
  slideTableTd: React.CSSProperties;
  slideQuote: React.CSSProperties;
  slideDescription: React.CSSProperties;
  slideHighlight: React.CSSProperties;
  slideStats: React.CSSProperties;
  slideKeypoint: React.CSSProperties;
  slideImage: React.CSSProperties;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  styles: TemplateStyles;
  backgroundClass?: string;
}

export const PLAIN_TEMPLATE: Template = {
  id: 'plain',
  name: 'Plain',
  description: 'A simple, minimal, and plainly styled template',
  backgroundClass: '',
  styles: {
    slideContent: {
      width: '100%',
      height: '100%',
      padding: '2rem',
      background: '#fff',
      color: '#222',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    slideTitle: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#222',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    slideSubtitle: {
      fontSize: '1.2rem',
      fontWeight: 400,
      color: '#555',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    slideList: {
      fontSize: '1rem',
      lineHeight: 1.6,
      margin: '1rem 0',
      paddingLeft: '1.5rem',
      color: '#222',
      listStyleType: 'disc',
      listStylePosition: 'outside',
    },
    slideTable: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '1rem 0',
      background: '#fff',
    },
    slideTableTh: {
      background: '#eee',
      color: '#222',
      padding: '0.5rem',
      textAlign: 'left',
      fontWeight: 600,
    },
    slideTableTd: {
      padding: '0.5rem',
      borderBottom: '1px solid #eee',
      color: '#222',
    },
    slideQuote: {
      fontSize: '1.2rem',
      fontStyle: 'italic',
      color: '#555',
      textAlign: 'center',
      margin: '1rem 0',
      padding: '1rem',
      borderLeft: '4px solid #ccc',
      background: '#fafafa',
    },
    slideDescription: {
      color: '#555',
      fontSize: '1rem',
      lineHeight: 1.5,
      textAlign: 'center',
      marginTop: '0.5rem',
    },
    slideHighlight: {
      background: '#f5f5f5',
      color: '#222',
      padding: '1rem',
      borderRadius: '4px',
      margin: '1rem 0',
      textAlign: 'center',
    },
    slideStats: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: '1rem 0',
    },
    slideKeypoint: {
      textAlign: 'center',
      padding: '0.5rem',
    },
    slideImage: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '4px',
      margin: '0.5rem auto',
      display: 'block',
    },
  },
};