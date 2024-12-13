import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePersonelStore } from '../store/personelStore';
import FormSection from './IzinBelgesi/FormSection';
import PDFPreview from './IzinBelgesi/PDFPreview';
import { generateIzinBelgesi } from '../utils/pdfGenerator';
import 'react-datepicker/dist/react-datepicker.css';

const IzinBelgesi: React.FC = () => {
  const { personeller, getPersonelByAdSoyad } = usePersonelStore();
  const [selectedPersonel, setSelectedPersonel] = useState('');
  const [izinBaslangic, setIzinBaslangic] = useState<Date>(new Date());
  const [izinBitis, setIzinBitis] = useState<Date>(new Date());
  const [izinTuru, setIzinTuru] = useState<'yillik' | 'haftalik'>('yillik');
  const [mudurAdSoyad, setMudurAdSoyad] = useState('');

  const handleGeneratePDF = () => {
    const personel = getPersonelByAdSoyad(selectedPersonel);
    if (!personel) return;

    generateIzinBelgesi({
      personel,
      izinTuru,
      izinBaslangic,
      izinBitis,
      mudurAdSoyad
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSection
          selectedPersonel={selectedPersonel}
          setSelectedPersonel={setSelectedPersonel}
          personeller={personeller}
          izinTuru={izinTuru}
          setIzinTuru={setIzinTuru}
          izinBaslangic={izinBaslangic}
          setIzinBaslangic={setIzinBaslangic}
          izinBitis={izinBitis}
          setIzinBitis={setIzinBitis}
          mudurAdSoyad={mudurAdSoyad}
          setMudurAdSoyad={setMudurAdSoyad}
          onGeneratePDF={handleGeneratePDF}
        />

        <PDFPreview
          selectedPersonel={selectedPersonel}
          izinTuru={izinTuru}
          izinBaslangic={izinBaslangic}
          izinBitis={izinBitis}
          mudurAdSoyad={mudurAdSoyad}
        />
      </div>
    </motion.div>
  );
};

export default IzinBelgesi;