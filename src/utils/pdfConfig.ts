import { jsPDF } from 'jspdf';

export const PDF_CONFIG = {
  format: 'a4',
  orientation: 'portrait',
  unit: 'mm',
  margins: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  },
  spacing: {
    lineHeight: 7,
    sectionGap: 15
  },
  fonts: {
    title: 16,
    subtitle: 14,
    heading: 12,
    normal: 11,
    small: 10,
    footer: 8
  },
  colors: {
    primary: [0, 0, 0], // RGB values
    secondary: [128, 128, 128]
  }
};

export const initializePDF = (): jsPDF => {
  const doc = new jsPDF({
    orientation: PDF_CONFIG.orientation,
    unit: PDF_CONFIG.unit,
    format: PDF_CONFIG.format
  });
  
  // Set default font
  doc.setFont('helvetica');
  doc.setFontSize(PDF_CONFIG.fonts.normal);
  doc.setTextColor(PDF_CONFIG.colors.primary[0], PDF_CONFIG.colors.primary[1], PDF_CONFIG.colors.primary[2]);
  
  return doc;
};