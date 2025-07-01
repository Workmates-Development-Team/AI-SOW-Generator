import React from 'react';

export interface Template {
  id: string;
  name: string;
  backgroundImage?: string;
  layout: {
    title: {
      position: React.CSSProperties;
      style: React.CSSProperties;
    };
    content: {
      position: React.CSSProperties;
      style: React.CSSProperties;
    };
  };
  backgroundClass?: string;
}

export const COVER_TEMPLATE: Template = {
  id: 'cover',
  name: 'Cover Template', 
  backgroundImage: '/1.svg',
  layout: {
    title: {
      position: {
        position: 'absolute',
        top: '25%',
        left: '3%',
        width: '70%',
      },
      style: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'left',
        lineHeight: '1.2',
      }
    },
    content: {
      position: {
        position: 'absolute',
        top: '85%',
        left: '3%',
        width: '80%',
      },
      style: {
        fontSize: '1.75rem',
        color: '#000000',
        lineHeight: '1.6',
      }
    }
  }
};

export const SCOPE_TEMPLATE: Template = {
  id: 'scope',
  name: 'Scope of Work Template',
  backgroundImage: '/2.svg',
  layout: {
    title: {
      position: {},
      style: {
        display: 'none',
      }
    },
    content: {
      position: {
        position: 'relative',
        left: '8%',
        width: '80%',
        marginTop: '3rem',
        top: '35%',
        maxHeight: '60vh',
      },
      style: {
        fontSize: '1rem',
        lineHeight: '1',
        color: '#333',
        padding: '4px',
        borderRadius: '8px',
      }
    }
  }
};

export const DELIVERABLES_TEMPLATE: Template = {
  id: 'deliverables',
  name: 'Deliverables Template',
  backgroundImage: '/3.svg',
  layout: {
    title: {
      position: {},
      style: {
        display: 'none',
      }
    },
    content: {
      position: {
        position: 'relative',
        left: '8%',
        width: '80%',
        marginTop: '3rem',
        top: '40%',
        maxHeight: '60vh',
      },
      style: {
        fontSize: '1.1rem',
        lineHeight: '1',
        color: '#333',
        padding: '4px',
        borderRadius: '8px',
      }
    }
  }
};

export const GENERIC_TEMPLATE: Template = {
  id: 'generic',
  name: 'Generic Template',
  backgroundImage: '/4.svg',
  layout: {
    title: {
      position: {
        position: 'relative',
        top: '10.3%',
        left: '12.8%',
        width: '77%',
      },
      style: {
        fontSize: '1.5rem',
        fontWeight: '300',
        marginBottom: '1.5rem',
        color: '#000',
        backgroundColor: '#fddc0d',
        padding: '7.3px 20px',
        display: 'inline-block',
      }
    },
    content: {
      position: {
        position: 'relative',
        left: '8%',
        width: '80%',
        marginTop: '8rem',
        maxHeight: '60vh',
      },
      style: {
        fontSize: '1.2rem',
        lineHeight: '1',
        color: '#333',
        padding: '4px',
        borderRadius: '8px',
      }
    }
  }
};

export const SIGNATURE_TEMPLATE: Template = {
  id: 'signature',
  name: 'Signature Template',
  backgroundImage: '/5.svg',
  layout: {
    title: {
      position: {},
      style: { display: 'none' }
    },
    content: {
      position: { position: 'absolute', top: '6.8%', left: '25%', width: '20%' },
      style: { fontSize: '1.3rem', color: '#000', textAlign: 'left', lineHeight: '1.2', fontWeight: 'bold' }
    }
  }
};

export const PLAIN_TEMPLATE: Template = {
  id: 'plainImage6',
  name: 'Plain Template with Image 6',
  backgroundImage: '/6.svg',
  layout: {
    title: {
      position: {
        marginBottom: '2rem',
      },
      style: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#000000',
      }
    },
    content: {
      position: {},
      style: {
        fontSize: '1.2rem',
        lineHeight: '1',
        color: '#333333',
        padding: '64px',
      }
    }
  }
};

export const TEMPLATES = {
  cover: COVER_TEMPLATE,
  scope: SCOPE_TEMPLATE,
  deliverables: DELIVERABLES_TEMPLATE,
  generic: GENERIC_TEMPLATE,
  plain: PLAIN_TEMPLATE,
  signature: SIGNATURE_TEMPLATE,
};