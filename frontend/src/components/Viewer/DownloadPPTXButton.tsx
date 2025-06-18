import React from 'react'
import pptxgen from 'pptxgenjs'
import { Button } from '@/components/ui/button'
import type { Slide, HtmlSlide, ChartSlide } from '@/types/presentation'

interface Props {
  slides: Slide[]
  title: string
}

const DownloadPPTXButton: React.FC<Props> = ({ slides, title }) => {
  const download = async () => {
    const pptx = new pptxgen()
    
    // Set presentation properties
    pptx.author = 'AI PPT Maker'
    pptx.company = 'AI PPT Maker'
    pptx.title = title
    pptx.subject = title
    
    // Set slide size to 16:9 aspect ratio
    pptx.layout = 'LAYOUT_16x9'

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      
      // Add a new slide
      const pptxSlide = pptx.addSlide()
      
      // Set slide background to dark theme
      pptxSlide.background = { color: '1f2937' }
      
      if (slide.type === 'chart') {
        const chartSlide = slide as ChartSlide
        
        // Validate chart data
        if (!chartSlide.chartConfig?.data?.labels || !chartSlide.chartConfig?.data?.datasets) {
          // Fallback to text if chart data is invalid
          pptxSlide.addText('Chart data unavailable', {
            x: 0.5,
            y: 2,
            w: 9,
            h: 2,
            fontSize: 24,
            color: 'FFFFFF',
            align: 'center'
          })
          continue
        }
        
        // Add chart title
        if (chartSlide.chartConfig.title) {
          pptxSlide.addText(chartSlide.chartConfig.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 1,
            fontSize: 28,
            color: 'FFFFFF',
            bold: true,
            align: 'center'
          })
        }
        
        // Add chart description if available
        if (chartSlide.chartConfig.description) {
          pptxSlide.addText(chartSlide.chartConfig.description, {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 0.5,
            fontSize: 16,
            color: 'CCCCCC',
            align: 'center'
          })
        }
        
        // Add chart based on type
        const chartY = chartSlide.chartConfig.description ? 2.5 : 2
        const chartHeight = 5
        
        try {
          const labels = chartSlide.chartConfig.data.labels
          const datasets = chartSlide.chartConfig.data.datasets
          
          if (chartSlide.chartConfig.type === 'pie' || chartSlide.chartConfig.type === 'doughnut') {
            // For pie/doughnut charts, use the first dataset
            if (datasets.length > 0 && datasets[0].data.length > 0) {
              // For now, let's show pie chart data as text to avoid the error
              let pieText = `${chartSlide.chartConfig.title || 'Pie Chart Data'}:\n\n`
              const total = datasets[0].data.reduce((sum, value) => sum + value, 0)
              
              datasets[0].data.forEach((value, index) => {
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                pieText += `${labels[index] || `Item ${index + 1}`}: ${value} (${percentage}%)\n`
              })
              
              pptxSlide.addText(pieText, {
                x: 0.5,
                y: chartY,
                w: 9,
                h: chartHeight,
                fontSize: 16,
                color: 'FFFFFF',
                align: 'left'
              })
            }
          } else {
            // For bar and line charts, create the data array in the correct format
            // pptxgenjs expects: [['Category', 'Series1', 'Series2'], ['Label1', value1, value2], ...]
            const chartData = []
            
            // First row: Category names (empty first cell, then labels)
            const headerRow = ['Category']
            datasets.forEach((dataset, index) => {
              headerRow.push(dataset.label || `Series ${index + 1}`)
            })
            chartData.push(headerRow)
            
            // Data rows: Each label with corresponding values
            labels.forEach((label, labelIndex) => {
              const dataRow = [label]
              datasets.forEach(dataset => {
                dataRow.push(String(dataset.data[labelIndex] || 0))
              })
              chartData.push(dataRow)
            })
            
            // For now, let's skip charts and just show the data as text to avoid the error
            let chartText = chartSlide.chartConfig.title || 'Chart Data:\n\n'
            
            labels.forEach((label, index) => {
              chartText += `${label}: `
              datasets.forEach((dataset, datasetIndex) => {
                chartText += `${dataset.label || `Series ${datasetIndex + 1}`}: ${dataset.data[index] || 0}  `
              })
              chartText += '\n'
            })
            
            pptxSlide.addText(chartText, {
              x: 0.5,
              y: chartY,
              w: 9,
              h: chartHeight,
              fontSize: 14,
              color: 'FFFFFF',
              align: 'left'
            })
          }
        } catch (error) {
          console.error('Error creating chart:', error)
          // Fallback to text if chart creation fails
          pptxSlide.addText('Chart could not be created', {
            x: 0.5,
            y: chartY,
            w: 9,
            h: 2,
            fontSize: 20,
            color: 'FFFFFF',
            align: 'center'
          })
        }
        
      } else {
        // For HTML slides, we need to parse the HTML and convert to PPTX elements
        const htmlSlide = slide as HtmlSlide
        
        // Create a temporary container to parse HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = htmlSlide.html
        document.body.appendChild(tempDiv)
        
        // Extract text content and structure
        const titleElement = tempDiv.querySelector('#slide-title')
        const subtitleElement = tempDiv.querySelector('#slide-subtitle')
        const contentElement = tempDiv.querySelector('#slide-content')
        const listElement = tempDiv.querySelector('#slide-list')
        const tableElement = tempDiv.querySelector('#slide-table')
        const descriptionElement = tempDiv.querySelector('#slide-description')
        const quoteElement = tempDiv.querySelector('#slide-quote')
        const statsElement = tempDiv.querySelector('#slide-stats')
        const highlightElement = tempDiv.querySelector('#slide-highlight')
        
        let currentY = 0.5
        
        // Add title
        if (titleElement) {
          pptxSlide.addText(titleElement.textContent || '', {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 1,
            fontSize: 32,
            color: 'FFFFFF',
            bold: true,
            align: 'center'
          })
          currentY += 1.2
        }
        
        // Add subtitle
        if (subtitleElement) {
          pptxSlide.addText(subtitleElement.textContent || '', {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 0.8,
            fontSize: 20,
            color: 'CCCCCC',
            align: 'center'
          })
          currentY += 1
        }
        
        // Add table if present
        if (tableElement) {
          const tableData = []
          const rows = tableElement.querySelectorAll('tr')
          
          rows.forEach((row, rowIndex) => {
            const rowData = []
            const cells = row.querySelectorAll('th, td')
            cells.forEach(cell => {
              rowData.push(cell.textContent || '')
            })
            tableData.push(rowData)
          })
          
          if (tableData.length > 0) {
            pptxSlide.addTable(tableData, {
              x: 0.5,
              y: currentY,
              w: 9,
              h: 4,
              fontSize: 14,
              color: 'FFFFFF',
              border: { type: 'solid', color: 'FFFFFF', pt: 1 },
              align: 'center',
              valign: 'middle',
              fill: { color: '374151' }
            })
            currentY += 4.5
          }
        }
        
        // Add list if present
        if (listElement) {
          const listItems = listElement.querySelectorAll('li')
          const listText = Array.from(listItems).map(item => `• ${item.textContent}`).join('\n')
          
          pptxSlide.addText(listText, {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 4,
            fontSize: 16,
            color: 'FFFFFF',
            align: 'left',
            bullet: { type: 'bullet' }
          })
          currentY += 4.5
        }
        
        // Add stats if present
        if (statsElement) {
          const statItems = statsElement.querySelectorAll('div')
          let statsText = ''
          
          statItems.forEach((item, index) => {
            const text = item.textContent || ''
            if (text.trim()) {
              statsText += text + (index < statItems.length - 1 ? '\n' : '')
            }
          })
          
          if (statsText) {
            pptxSlide.addText(statsText, {
              x: 0.5,
              y: currentY,
              w: 9,
              h: 3,
              fontSize: 18,
              color: 'FFFFFF',
              align: 'center',
              bold: true
            })
            currentY += 3.5
          }
        }
        
        // Add quote if present
        if (quoteElement) {
          pptxSlide.addText(quoteElement.textContent || '', {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 2,
            fontSize: 20,
            color: 'FBBF24',
            align: 'center',
            italic: true
          })
          currentY += 2.5
        }
        
        // Add highlight if present
        if (highlightElement) {
          pptxSlide.addText(highlightElement.textContent || '', {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 1,
            fontSize: 16,
            color: '10B981',
            align: 'center',
            bold: true
          })
          currentY += 1.5
        }
        
        // Add description if present and there's space
        if (descriptionElement && currentY < 6) {
          pptxSlide.addText(descriptionElement.textContent || '', {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 1,
            fontSize: 14,
            color: 'CCCCCC',
            align: 'center'
          })
        }
        
        // Clean up temporary element
        document.body.removeChild(tempDiv)
      }
    }

    // Save the presentation
    pptx.writeFile({ fileName: `${title}.pptx` })
  }

  return (
    <Button
      onClick={download}
      variant="outline"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
    >
      Download PPTX
    </Button>
  )
}

export default DownloadPPTXButton