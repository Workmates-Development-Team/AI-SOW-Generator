import { useState } from 'react';

export const useTemplate = (initialTemplate: string = 'modern-dark') => {
  const [currentTemplate, setCurrentTemplate] = useState(initialTemplate);

  const changeTemplate = (templateId: string) => {
    setCurrentTemplate(templateId);
  };

  return {
    currentTemplate,
    changeTemplate,
    isLoading: false, // No loading needed with CSS-in-JS
  };
};