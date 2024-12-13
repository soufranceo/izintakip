import { jsPDF } from 'jspdf';

export const configurePDFStyles = (doc: jsPDF) => {
  doc.setFont('helvetica');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
};

export const PAGE_CONFIG = {
  margins: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  },
  spacing: {
    lineHeight: 7,
    sectionGap: 15
  }
};