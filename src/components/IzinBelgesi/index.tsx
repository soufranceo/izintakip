import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, User, ClipboardCheck } from 'lucide-react';
import { usePersonelStore } from '../../store/personelStore';
import FormSection from './FormSection';
import PDFPreview from './PDFPreview';
import { generateIzinBelgesi } from '../../utils/pdfGenerator';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8" />
          <h1 className="text-3xl font-bold">İzin Belgesi Oluşturma</h1>
        </div>
        <p className="text-blue-100">
          Bu sayfada personel izin belgelerini oluşturabilir ve PDF formatında indirebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-xl shadow">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <User className="w-5 h-5" />
                <h3 className="font-semibold">Personel</h3>
              </div>
              <p className="text-sm text-blue-600">
                Aktif personel sayısı: {personeller.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Calendar className="w-5 h-5" />
                <h3 className="font-semibold">İzin Türleri</h3>
              </div>
              <p className="text-sm text-green-600">
                Yıllık ve Haftalık İzinler
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl shadow">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <ClipboardCheck className="w-5 h-5" />
                <h3 className="font-semibold">Belgeler</h3>
              </div>
              <p className="text-sm text-purple-600">
                PDF formatında çıktı
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <PDFPreview
            selectedPersonel={selectedPersonel}
            izinTuru={izinTuru}
            izinBaslangic={izinBaslangic}
            izinBitis={izinBitis}
            mudurAdSoyad={mudurAdSoyad}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default IzinBelgesi;