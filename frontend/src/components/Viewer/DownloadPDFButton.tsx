import React from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Slide {
  id: string;
  type: string;
  html: string;
}

interface DownloadPDFButtonProps {
  slides: Slide[];
  title: string;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ slides, title }) => {
  const handleDownloadPDF = async () => {
    const container = document.createElement('div');
    container.style.width = '1280px';

    slides.forEach((slide) => {
      const slideDiv = document.createElement('div');
      slideDiv.innerHTML = slide.html;
      slideDiv.style.pageBreakAfter = 'always';
      slideDiv.style.width = '1920px';
      slideDiv.style.height = '1080px';
      slideDiv.style.marginBottom = '80px';
      container.appendChild(slideDiv);
    });

    html2pdf()
      .set({
        margin: 0,
        filename: `${title || 'presentation'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'px', format: [1920, 1080], orientation: 'landscape' },
        pagebreak: { mode: ['css'] }
      })
      .from(container)
      .save();
  };

  return (
    <Button variant="outline" className='text-white' onClick={handleDownloadPDF}>
      <Download className="text-white w-4 h-4 mr-2" />
      Download as PDF
    </Button>
  );
};

export default DownloadPDFButton;