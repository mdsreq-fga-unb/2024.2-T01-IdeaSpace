import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF(elements: HTMLElement[], title: string) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 20;
  let currentY = margin;

  // Add title
  pdf.setFontSize(16);
  pdf.text(title, margin, currentY);
  currentY += 15;

  for (const element of elements) {
    // Temporarily force light theme for PDF generation
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      // Restore dark theme if it was active
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
      
      const imgWidth = 210 - (2 * margin); // A4 width minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if we need a new page
      if (currentY + imgHeight > 297 - margin) { // A4 height minus margin
        pdf.addPage();
        currentY = margin;
      }
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10;
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  const timestamp = new Date().toISOString().split('T')[0];
  pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`);
}