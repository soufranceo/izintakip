import React from 'react';
import { Calendar, User, FileText, UserCheck } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { tr } from 'date-fns/locale';
import { Personel } from '../../store/personelStore';
import 'react-datepicker/dist/react-datepicker.css';

interface FormSectionProps {
  selectedPersonel: string;
  setSelectedPersonel: (value: string) => void;
  personeller: Personel[];
  izinTuru: 'yillik' | 'haftalik';
  setIzinTuru: (value: 'yillik' | 'haftalik') => void;
  izinBaslangic: Date;
  setIzinBaslangic: (date: Date) => void;
  izinBitis: Date;
  setIzinBitis: (date: Date) => void;
  mudurAdSoyad: string;
  setMudurAdSoyad: (value: string) => void;
  onGeneratePDF: () => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  selectedPersonel,
  setSelectedPersonel,
  personeller,
  izinTuru,
  setIzinTuru,
  izinBaslangic,
  setIzinBaslangic,
  izinBitis,
  setIzinBitis,
  mudurAdSoyad,
  setMudurAdSoyad,
  onGeneratePDF
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <User className="w-4 h-4 text-blue-600" />
            Personel Seçimi
          </label>
          <select
            value={selectedPersonel}
            onChange={(e) => setSelectedPersonel(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            required
          >
            <option value="">Personel Seçiniz</option>
            {personeller.map((personel) => (
              <option key={personel.id} value={`${personel.ad} ${personel.soyad}`}>
                {personel.ad} {personel.soyad}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-blue-600" />
            İzin Türü
          </label>
          <select
            value={izinTuru}
            onChange={(e) => setIzinTuru(e.target.value as 'yillik' | 'haftalik')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
          >
            <option value="yillik">Yıllık İzin</option>
            <option value="haftalik">Haftalık İzin</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-blue-600" />
            İzin Başlangıç Tarihi
          </label>
          <DatePicker
            selected={izinBaslangic}
            onChange={(date: Date) => setIzinBaslangic(date)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            dateFormat="dd/MM/yyyy"
            locale={tr}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-blue-600" />
            İzin Bitiş Tarihi
          </label>
          <DatePicker
            selected={izinBitis}
            onChange={(date: Date) => setIzinBitis(date)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            dateFormat="dd/MM/yyyy"
            minDate={izinBaslangic}
            locale={tr}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Sorumlu Müdür Ad Soyad
          </label>
          <input
            type="text"
            value={mudurAdSoyad}
            onChange={(e) => setMudurAdSoyad(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            placeholder="Örn: Ahmet Yılmaz"
            required
          />
        </div>
      </div>

      <button
        onClick={onGeneratePDF}
        disabled={!selectedPersonel || !mudurAdSoyad}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium"
      >
        <FileText className="w-5 h-5" />
        PDF Belgesi Oluştur
      </button>
    </div>
  );
};

export default FormSection;