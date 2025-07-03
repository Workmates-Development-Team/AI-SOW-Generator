import React from 'react';

const SOWNumberSection: React.FC<{ sowNumber?: string }> = ({ sowNumber }) => {
  if (!sowNumber) return null;
  return (
    <span style={{
      position: 'absolute',
      top: '460%',
      right: '-38%',
      fontSize: '1.2rem',
      color: '#1e3a8a',
      fontWeight: 500,
      padding: '0.5rem 1.2rem',
      zIndex: 10,
    }}>
      SOW Number: {sowNumber}
    </span>
  );
};

export default SOWNumberSection;
export { SOWNumberSection }; 