import { jsPDF } from 'jspdf';
import { Personel } from '../store/personelStore';
import { formatDateTR } from './dateFormatters';
import { calculateLeaveDays } from './leaveUtils';

interface PDFGeneratorOptions {
  personel: Personel;
  izinTuru: 'yillik' | 'haftalik';
  izinBaslangic: Date;
  izinBitis: Date;
  mudurAdSoyad: string;
}

export const generateIzinBelgesi = (options: PDFGeneratorOptions): void => {
  const { personel, izinTuru, izinBaslangic, izinBitis, mudurAdSoyad } = options;
  const izinGun = calculateLeaveDays(izinBaslangic, izinBitis);

  // Initialize PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Use built-in font
  doc.setFont('helvetica', 'bold');

  // Header
  doc.setFontSize(16);
  doc.setTextColor(0, 102, 204);
  const header = 'Çalışan Personel İzin Belgesi';
  
  // Center align header
  const pageWidth = doc.internal.pageSize.width;
  const headerWidth = doc.getStringUnitWidth(header) * 16 / doc.internal.scaleFactor;
  
  doc.text(header, (pageWidth - headerWidth) / 2, 25);

  // Reset font to normal for content
  doc.setFont('helvetica', 'normal');

  // Document Info
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const belgeNo = `BN-${Date.now().toString().slice(-6)}`;
  doc.text(`Belge No: ${belgeNo}`, 20, 45);
  doc.text(`Tarih: ${formatDateTR(new Date())}`, 20, 50);

  // Personnel Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PERSONEL BİLGİLERİ', 20, 65);
  doc.line(20, 67, 190, 67);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const personalInfo = [
    [`Ad Soyad: ${personel.ad} ${personel.soyad}`, 75],
    [`TC No: ${personel.tcNo}`, 82],
    [`Telefon: ${personel.telefon}`, 89],
    [`Bölüm: ${personel.bolum}`, 96],
    [`İşe Giriş Tarihi: ${formatDateTR(new Date(personel.isGirisTarihi))}`, 103],
  ];

  personalInfo.forEach(([text, y]) => {
    doc.text(text as string, 25, y as number);
  });

  // Leave Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('İZİN BİLGİLERİ', 20, 115);
  doc.line(20, 117, 190, 117);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const leaveInfo = [
    [`İzin Türü: ${izinTuru === 'yillik' ? 'Yıllık İzin' : 'Haftalık İzin'}`, 125],
    [`Başlangıç Tarihi: ${formatDateTR(izinBaslangic)}`, 132],
    [`Bitiş Tarihi: ${formatDateTR(izinBitis)}`, 139],
    [`İzin Süresi: ${izinGun} gün`, 146],
  ];

  leaveInfo.forEach(([text, y]) => {
    doc.text(text as string, 25, y as number);
  });

  // Signature Area
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('İMZALAR', 20, 160);
  doc.line(20, 162, 190, 162);

  const boxHeight = 30;
  const boxWidth = 70;
  const signatureY = 170;

  // Employee signature box
  doc.rect(25, signatureY, boxWidth, boxHeight);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Personel', 45, signatureY + 10);
  doc.text(`${personel.ad} ${personel.soyad}`, 45, signatureY + 15);
  doc.text('İmza:', 45, signatureY + 20);

  // Manager signature box
  doc.rect(115, signatureY, boxWidth, boxHeight);
  doc.text('Sorumlu Müdür', 130, signatureY + 10);
  doc.text(mudurAdSoyad, 130, signatureY + 15);
  doc.text('İmza:', 130, signatureY + 20);

  // Footer
  doc.setFontSize(8);
  doc.text('Bu belge elektronik ortamda oluşturulmuştur.', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`personel-izin-belgesi-${personel.ad}-${personel.soyad}.pdf`);
};