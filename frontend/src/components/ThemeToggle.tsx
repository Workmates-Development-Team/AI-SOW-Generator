
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const buttonClass = theme === 'light' ? 'text-gray-800 focus:ring-gray-500 border border-gray-300' : 'text-white focus:ring-white border border-white/20';

  return (
    <button
      onClick={toggleTheme}
      className={`bg-transparent border-0 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${buttonClass}`}
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
