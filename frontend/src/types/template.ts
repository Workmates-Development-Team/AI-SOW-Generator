import React from 'react';

export interface Template {
  id: string;
  name: string;
  backgroundImage?: string;
  styles: {
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
    slideHeader: React.CSSProperties;
    slideFooter: React.CSSProperties;
  };
  backgroundClass?: string;
  customCSS?: string;
}

// Template styles for overlaying text on images
const getOverlayTextStyles = (titleColor = '#000', textColor = '#333') => ({
  slideContent: {
    padding: '60px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%',
    color: textColor,
    fontFamily: 'Arial, sans-serif',
    position: 'relative' as const,
  },
  slideTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: titleColor,
    textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
  },
  slideSubtitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: titleColor,
    textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
  },
  slideList: {
    fontSize: '1.2rem',
    lineHeight: '1.8',
    paddingLeft: '1.5rem',
    color: textColor,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
  },
  slideTable: {
    width: '90%',
    borderCollapse: 'collapse' as const,
    marginTop: '1rem',
    fontSize: '1rem',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  slideTableTh: {
    backgroundColor: '#1e3a8a',
    color: '#fbbf24',
    padding: '12px',
    textAlign: 'left' as const,
    fontWeight: 'bold',
  },
  slideTableTd: {
    padding: '10px 12px',
    borderBottom: '1px solid #ddd',
    color: '#000',
  },
  slideQuote: {
    fontSize: '1.4rem',
    fontStyle: 'italic',
    padding: '1.5rem',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: '8px',
    margin: '1rem 0',
    width: '80%',
  },
  slideDescription: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    color: textColor,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
  },
  slideHighlight: {
    backgroundColor: 'rgba(251, 191, 36, 0.9)',
    color: '#1e3a8a',
    padding: '1.5rem',
    borderRadius: '8px',
    margin: '1.5rem 0',
    border: '2px solid #1e3a8a',
    width: '80%',
    fontWeight: 'bold',
  },
  slideStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    margin: '2rem 0',
  },
  slideKeypoint: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center' as const,
    border: '2px solid #1e3a8a',
  },
  slideImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  slideHeader: {
    marginBottom: '2rem',
  },
  slideFooter: {
    marginTop: 'auto',
    fontSize: '0.9rem',
    color: '#666666',
  },
});

export const COVER_TEMPLATE: Template = {
  id: 'cover',
  name: 'Cover Template',
  backgroundImage: '/1.svg',
  styles: {
    ...getOverlayTextStyles('#1e3a8a', '#1e3a8a'),
    slideContent: {
      ...getOverlayTextStyles('#1e3a8a', '#1e3a8a').slideContent,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center' as const,
    },
    slideTitle: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      color: '#1e3a8a',
      textShadow: '3px 3px 6px rgba(255,255,255,0.9)',
    },
    slideSubtitle: {
      fontSize: '2.2rem',
      fontWeight: '600',
      marginBottom: '2rem',
      color: '#1e3a8a',
      textShadow: '2px 2px 4px rgba(255,255,255,0.9)',
    },
  },
};

export const SCOPE_TEMPLATE: Template = {
  id: 'scope',
  name: 'Scope of Work Template',
  backgroundImage: '/2.svg',
  styles: getOverlayTextStyles('#000', '#333'),
};

export const DELIVERABLES_TEMPLATE: Template = {
  id: 'deliverables',
  name: 'Deliverables Template',
  backgroundImage: '/3.svg',
  styles: getOverlayTextStyles('#000', '#333'),
};

export const GENERIC_TEMPLATE: Template = {
  id: 'generic',
  name: 'Generic Template',
  backgroundImage: '/4.svg',
  styles: getOverlayTextStyles('#000', '#333'),
};

export const PLAIN_TEMPLATE: Template = {
  id: 'plain',
  name: 'Plain Template',
  styles: {
    slideContent: {
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: '100%',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
    },
    slideTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#000000',
    },
    slideSubtitle: {
      fontSize: '1.8rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#333333',
    },
    slideList: {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      paddingLeft: '1.5rem',
    },
    slideTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1rem',
      fontSize: '1rem',
    },
    slideTableTh: {
      backgroundColor: '#f0f0f0',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '2px solid #ddd',
      fontWeight: 'bold',
    },
    slideTableTd: {
      padding: '10px 12px',
      borderBottom: '1px solid #ddd',
    },
    slideQuote: {
      fontSize: '1.5rem',
      fontStyle: 'italic',
      padding: '1rem',
      borderLeft: '4px solid #ccc',
      margin: '1rem 0',
    },
    slideDescription: {
      fontSize: '1.2rem',
      lineHeight: '1.6',
      color: '#555555',
    },
    slideHighlight: {
      backgroundColor: '#ffffcc',
      padding: '1rem',
      borderRadius: '4px',
      margin: '1rem 0',
    },
    slideStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      margin: '1rem 0',
    },
    slideKeypoint: {
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center',
    },
    slideImage: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '4px',
    },
    slideHeader: {
      marginBottom: '2rem',
    },
    slideFooter: {
      marginTop: '2rem',
      fontSize: '0.9rem',
      color: '#666666',
    },
  },
};

export const TEMPLATES = {
  cover: COVER_TEMPLATE,
  scope: SCOPE_TEMPLATE,
  deliverables: DELIVERABLES_TEMPLATE,
  generic: GENERIC_TEMPLATE,
  plain: PLAIN_TEMPLATE,
};