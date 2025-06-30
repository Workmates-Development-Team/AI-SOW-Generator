import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import type { Slide } from '@/types/presentation'

interface Props {
  slides: Slide[]
  title: string;
}

 const DownloadPDFButton: React.FC<Props> = ({ slides, title }) => {
  const download = async () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const slideNodes = Array.from(
      document.querySelectorAll(".slide-content-export")
    ) as HTMLElement[];

    for (let i = 0; i < slideNodes.length; i++) {
      const node = slideNodes[i];
      const prevDisplay = node.style.display;
      node.style.display = '';
      const canvas = await html2canvas(node, {
        backgroundColor: window.getComputedStyle(node).backgroundColor || "#fff",
        scale: 2,
        useCORS: true,
        logging: false,
        removeContainer: true,
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
      });
      node.style.display = prevDisplay;
      const imgData = canvas.toDataURL("image/png");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      if (i < slideNodes.length - 1) {
        pdf.addPage();
      }
    }
    pdf.save(`${title}.pdf`);
  };

  return (
    <Button
      onClick={download}
      variant="outline"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      Download PDF
    </Button>
  );
};

export default DownloadPDFButton;
