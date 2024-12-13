import React from 'react';
import DatePicker from 'react-datepicker';
import { tr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

interface IzinFormProps {
  izinTuru: 'yillik' | 'haftalik';
  setIzinTuru: (value: 'yillik' | 'haftalik') => void;
  izinBaslangic: Date;
  setIzinBaslangic: (date: Date) => void;
  izinBitis: Date;
  setIzinBitis: (date: Date) => void;
  mudurAdSoyad: string;
  setMudurAdSoyad: (value: string) => void;
}

const IzinForm: React.FC<IzinFormProps> = ({
  izinTuru,
  setIzinTuru,
  izinBaslangic,
  setIzinBaslangic,
  izinBitis,
  setIzinBitis,
  mudurAdSoyad,
  setMudurAdSoyad
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İzin Türü
        </label>
        <select
          value={izinTuru}
          onChange={(e) => setIzinTuru(e.target.value as 'yillik' | 'haftalik')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="yillik">Yıllık İzin</option>
          <option value="haftalik">Haftalık İzin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İzin Başlangıç Tarihi
        </label>
        <DatePicker
          selected={izinBaslangic}
          onChange={(date: Date) => setIzinBaslangic(date)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          dateFormat="dd/MM/yyyy"
          locale={tr}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İzin Bitiş Tarihi
        </label>
        <DatePicker
          selected={izinBitis}
          onChange={(date: Date) => setIzinBitis(date)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          dateFormat="dd/MM/yyyy"
          minDate={izinBaslangic}
          locale={tr}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sorumlu Müdür Ad Soyad
        </label>
        <input
          type="text"
          value={mudurAdSoyad}
          onChange={(e) => setMudurAdSoyad(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Örn: Ahmet Yılmaz"
          required
        />
      </div>
    </>
  );
};

export default IzinForm;