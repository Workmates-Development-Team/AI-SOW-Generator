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
        top: '45%',
        left: '3%',
        width: '70%',
      },
      style: {
        fontSize: '1.2rem',
        color: '#ffffff',
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
      position: {
        position: 'relative',
        top: '6%',
        left: '8%',
        width: '80%',
      },
      style: {
        fontSize: '1.75rem',
        fontWeight: '300',
        marginBottom: '1.5rem',
        color: '#000',
        backgroundColor: '#fddc0d',
        padding: '10px 20px',
        display: 'inline-block',
      }
    },
    content: {
      position: {
        position: 'relative',
        left: '8%',
        width: '80%',
        marginTop: '2rem',
      },
      style: {
        fontSize: '1rem',
        lineHeight: '1.8',
        color: '#333',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '20px',
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
      position: {
        position: 'relative',
        top: '6%',
        left: '8%',
        width: '80%',
      },
      style: {
        fontSize: '1.75rem',
        fontWeight: '300',
        marginBottom: '1.5rem',
        color: '#000',
        backgroundColor: '#fddc0d',
        padding: '10px 20px',
        display: 'inline-block',
      }
    },
    content: {
      position: {
        position: 'relative',
        left: '8%',
        width: '80%',
        marginTop: '2rem',
      },
      style: {
        fontSize: '0.9rem',
        color: '#333',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '20px',
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
        top: '6%',
        left: '8%',
        width: '80%',
      },
      style: {
        fontSize: '1.75rem',
        fontWeight: '300',
        marginBottom: '1.5rem',
        color: '#000',
        backgroundColor: '#fddc0d',
        padding: '10px 20px',
        display: 'inline-block',
      }
    },
    content: {
      position: {
        position: 'relative',
        left: '8%',
        width: '80%',
        marginTop: '2rem',
      },
      style: {
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '20px',
        borderRadius: '8px',
      }
    }
  }
};

export const PLAIN_TEMPLATE: Template = {
  id: 'plain',
  name: 'Plain Template',
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
        lineHeight: '1.6',
        color: '#333333',
      }
    }
  }
};

export const IMAGE5_TEMPLATE: Template = {
  id: 'image5',
  name: 'Image 5 Template',
  backgroundImage: '/5.svg',
  layout: {
    title: {
      position: { position: 'absolute', top: '40%', left: '10%', width: '80%' },
      style: { fontSize: '2rem', color: '#fff', textAlign: 'center', fontWeight: 'bold' }
    },
    content: {
      position: { position: 'absolute', top: '60%', left: '10%', width: '80%' },
      style: { fontSize: '1.2rem', color: '#fff', textAlign: 'center' }
    }
  }
};

export const IMAGE6_TEMPLATE: Template = {
  id: 'image6',
  name: 'Image 6 Template',
  backgroundImage: '/6.svg',
  layout: {
    title: {
      position: { position: 'absolute', top: '40%', left: '10%', width: '80%' },
      style: { fontSize: '2rem', color: '#fff', textAlign: 'center', fontWeight: 'bold' }
    },
    content: {
      position: { position: 'absolute', top: '60%', left: '10%', width: '80%' },
      style: { fontSize: '1.2rem', color: '#fff', textAlign: 'center' }
    }
  }
};

export const IMAGE7_TEMPLATE: Template = {
  id: 'image7',
  name: 'Image 7 Template',
  backgroundImage: '/7.svg',
  layout: {
    title: {
      position: { position: 'absolute', top: '40%', left: '10%', width: '80%' },
      style: { fontSize: '2rem', color: '#fff', textAlign: 'center', fontWeight: 'bold' }
    },
    content: {
      position: { position: 'absolute', top: '60%', left: '10%', width: '80%' },
      style: { fontSize: '1.2rem', color: '#fff', textAlign: 'center' }
    }
  }
};

export const IMAGE8_TEMPLATE: Template = {
  id: 'image8',
  name: 'Image 8 Template',
  backgroundImage: '/8.svg',
  layout: {
    title: {
      position: { position: 'absolute', top: '40%', left: '10%', width: '80%' },
      style: { fontSize: '2rem', color: '#fff', textAlign: 'center', fontWeight: 'bold' }
    },
    content: {
      position: { position: 'absolute', top: '60%', left: '10%', width: '80%' },
      style: { fontSize: '1.2rem', color: '#fff', textAlign: 'center' }
    }
  }
};

export const IMAGE9_TEMPLATE: Template = {
  id: 'image9',
  name: 'Image 9 Template',
  backgroundImage: '/9.svg',
  layout: {
    title: {
      position: { position: 'absolute', top: '40%', left: '10%', width: '80%' },
      style: { fontSize: '2rem', color: '#fff', textAlign: 'center', fontWeight: 'bold' }
    },
    content: {
      position: { position: 'absolute', top: '60%', left: '10%', width: '80%' },
      style: { fontSize: '1.2rem', color: '#fff', textAlign: 'center' }
    }
  }
};

export const TEMPLATES = {
  cover: COVER_TEMPLATE,
  scope: SCOPE_TEMPLATE,
  deliverables: DELIVERABLES_TEMPLATE,
  generic: GENERIC_TEMPLATE,
  plain: PLAIN_TEMPLATE,
  image5: IMAGE5_TEMPLATE,
  image6: IMAGE6_TEMPLATE,
  image7: IMAGE7_TEMPLATE,
  image8: IMAGE8_TEMPLATE,
  image9: IMAGE9_TEMPLATE,
};