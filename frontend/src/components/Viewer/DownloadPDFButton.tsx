import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'

interface Slide {
  id: string
  html: string
}
interface Props {
  slides: Slide[]
  title: string
}

const DownloadPDFButton: React.FC<Props> = ({ slides, title }) => {
  const download = async () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1920, 1080],
    })

    for (let i = 0; i < slides.length; i++) {
      // create an off-screen container with the slide’s HTML
      const holder = document.createElement('div')
      holder.style.width = '1920px'
      holder.style.height = '1080px'
      holder.style.position = 'fixed'
      holder.style.left = '-9999px'
      holder.innerHTML = slides[i].html
      document.body.appendChild(holder)

      const canvas = await html2canvas(holder, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      })
      const img = canvas.toDataURL('image/png')
      if (i !== 0) pdf.addPage()
      pdf.addImage(img, 'PNG', 0, 0, 1920, 1080)

      document.body.removeChild(holder)
    }

    pdf.save(`${title}.pdf`)
  }

  return (
    <Button
      onClick={download}
      variant="outline"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      Download PDF
    </Button>
  )
}

export default DownloadPDFButton