import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const BackToGeneratorButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate('/')}
      variant="outline"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      Back to Generator
    </Button>
  );
};

export default BackToGeneratorButton; 