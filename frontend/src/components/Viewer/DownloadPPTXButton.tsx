import React from "react";
import PptxGenJS from "pptxgenjs";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import type { Slide, HtmlSlide, ChartSlide } from '@/types/presentation'

interface Props {
  slides: Slide[]
  title: string;
}

const DownloadPPTXButton: React.FC<Props> = ({ slides, title }) => {
  const download = async () => {
    const pptx = new PptxGenJS();
    pptx.author = "AI PPT Maker";
    pptx.company = "AI PPT Maker";
    pptx.title = title;
    pptx.subject = title;
    pptx.layout = "LAYOUT_16x9";

    // 1. Get all slide-content divs in order
    const slideNodes = Array.from(
      document.querySelectorAll("#slide-content")
    ) as HTMLElement[];

    // 2. Convert each slide to an image
    const images: string[] = [];
    for (const node of slideNodes) {
      // Optionally, scroll into view or wait for images/fonts to load
      const dataUrl = await toPng(node, {
        backgroundColor: "#1f2937", // match your dark theme
        cacheBust: true,
        pixelRatio: 2, // higher quality
      });
      images.push(dataUrl);
    }

    // 3. Add each image as a slide
    images.forEach((img) => {
      const slide = pptx.addSlide();
      slide.addImage({
        data: img,
        x: 0,
        y: 0,
        w: 10,
        h: 5.625,
      });
    });

    // 4. Download the PPTX
    await pptx.writeFile({ fileName: `${title}.pptx` });
  };

  return (
    <Button
      onClick={download}
      variant="outline"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      Download PPTX
    </Button>
  );
};

export default DownloadPPTXButton;
