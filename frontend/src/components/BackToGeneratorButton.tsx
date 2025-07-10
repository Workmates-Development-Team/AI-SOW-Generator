import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

const BackToGeneratorButton: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const buttonClass = theme === 'light'
    ? 'bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300'
    : 'bg-white/10 border-white/20 text-white hover:bg-white/20';

  return (
    <Button
      onClick={() => navigate('/')}
      variant="outline"
      className={buttonClass}
    >
      Back to Generator
    </Button>
  );
};

export default BackToGeneratorButton; 