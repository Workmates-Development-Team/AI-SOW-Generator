import React from 'react';

export interface Template {
  id: string;
  name: string;
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

export const SOW_TEMPLATE: Template = {
  id: 'sow',
  name: 'Statement of Work Template',
  styles: {
    slideContent: {
      padding: '60px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      height: '100%',
      backgroundColor: '#1e3a8a',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    },
    slideTitle: {
      fontSize: '2.8rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#ffffff',
      zIndex: 10,
      position: 'relative',
    },
    slideSubtitle: {
      fontSize: '1.6rem',
      fontWeight: '600',
      marginBottom: '2rem',
      color: '#fbbf24',
      zIndex: 10,
      position: 'relative',
    },
    slideList: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
      paddingLeft: '1.5rem',
      color: '#ffffff',
      zIndex: 10,
      position: 'relative',
    },
    slideTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1.5rem',
      fontSize: '0.95rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
      zIndex: 10,
      position: 'relative',
    },
    slideTableTh: {
      backgroundColor: '#fbbf24',
      color: '#1e3a8a',
      padding: '15px 12px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    slideTableTd: {
      padding: '12px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
    },
    slideQuote: {
      fontSize: '1.4rem',
      fontStyle: 'italic',
      padding: '1.5rem',
      borderLeft: '4px solid #fbbf24',
      margin: '1.5rem 0',
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
      color: '#ffffff',
      zIndex: 10,
      position: 'relative',
    },
    slideDescription: {
      fontSize: '1.1rem',
      lineHeight: '1.7',
      color: '#e5e7eb',
      zIndex: 10,
      position: 'relative',
    },
    slideHighlight: {
      backgroundColor: 'rgba(251, 191, 36, 0.2)',
      color: '#fbbf24',
      padding: '1.5rem',
      borderRadius: '8px',
      margin: '1.5rem 0',
      border: '2px solid #fbbf24',
      zIndex: 10,
      position: 'relative',
    },
    slideStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      margin: '2rem 0',
      zIndex: 10,
      position: 'relative',
    },
    slideKeypoint: {
      backgroundColor: 'rgba(251, 191, 36, 0.15)',
      padding: '1.5rem',
      borderRadius: '12px',
      textAlign: 'center',
      border: '1px solid rgba(251, 191, 36, 0.3)',
      zIndex: 10,
      position: 'relative',
    },
    slideImage: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px',
      border: '2px solid #fbbf24',
      zIndex: 10,
      position: 'relative',
    },
    slideHeader: {
      marginBottom: '3rem',
      zIndex: 10,
      position: 'relative',
    },
    slideFooter: {
      marginTop: 'auto',
      fontSize: '0.9rem',
      color: '#9ca3af',
      borderTop: '1px solid rgba(251, 191, 36, 0.3)',
      paddingTop: '1rem',
      zIndex: 10,
      position: 'relative',
    },
  },
  customCSS: `
    .sow-template .slide-content::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 60%;
      height: 40%;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      clip-path: polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%);
      z-index: 1;
    }
    
    .sow-template .slide-content::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50%;
      height: 30%;
      background: linear-gradient(45deg, #fbbf24 0%, #f59e0b 100%);
      clip-path: polygon(0% 0%, 60% 0%, 100% 100%, 0% 100%);
      z-index: 1;
    }
    
    .sow-template .workmates-logo {
      position: absolute;
      top: 30px;
      left: 40px;
      z-index: 20;
      color: #ffffff;
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    .sow-template .workmates-logo::before {
      content: '⚡⚡⚡';
      margin-right: 10px;
      color: #fbbf24;
    }
  `,
  backgroundClass: 'sow-template',
};

export const TEMPLATES = {
  plain: PLAIN_TEMPLATE,
  sow: SOW_TEMPLATE,
};