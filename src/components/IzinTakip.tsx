import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { usePersonelStore } from '../store/personelStore';
import { calculateLeaveDays, validateLeaveBalance } from '../utils/leaveUtils';
import 'react-datepicker/dist/react-datepicker.css';
import { tr } from 'date-fns/locale';

function IzinTakip() {
  const { personeller, addIzinKayit, getPersonelByAdSoyad, getKalanIzin } = usePersonelStore();
  const [selectedPersonel, setSelectedPersonel] = useState('');
  const [baslangicTarihi, setBaslangicTarihi] = useState<Date>(new Date());
  const [bitisTarihi, setBitisTarihi] = useState<Date>(new Date());
  const [izinTuru, setIzinTuru] = useState<'yillik' | 'haftalik'>('yillik');
  const [showError, setShowError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const personel = getPersonelByAdSoyad(selectedPersonel);
    if (!personel) return;

    const gun = calculateLeaveDays(baslangicTarihi, bitisTarihi);
    const kalanIzin = getKalanIzin(personel.id, izinTuru);

    const validation = validateLeaveBalance(kalanIzin, gun, izinTuru);

    if (!validation.isValid) {
      setShowError(validation.message);
      return;
    }

    const yeniIzin = {
      personelId: personel.id,
      baslangicTarihi,
      bitisTarihi,
      izinTuru,
      gun,
    };
    
    addIzinKayit(yeniIzin);
    resetForm();
  };

  const resetForm = () => {
    setSelectedPersonel('');
    setBaslangicTarihi(new Date());
    setBitisTarihi(new Date());
    setIzinTuru('yillik');
    setShowError(null);
  };

  return (
    <div className="space-y-8">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personel
          </label>
          <select
            value={selectedPersonel}
            onChange={(e) => setSelectedPersonel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {selectedPersonel && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Kalan İzin: {getKalanIzin(getPersonelByAdSoyad(selectedPersonel)?.id || 0, izinTuru)} gün
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlangıç Tarihi
          </label>
          <DatePicker
            selected={baslangicTarihi}
            onChange={(date: Date) => setBaslangicTarihi(date)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dateFormat="dd/MM/yyyy"
            locale={tr}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bitiş Tarihi
          </label>
          <DatePicker
            selected={bitisTarihi}
            onChange={(date: Date) => setBitisTarihi(date)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dateFormat="dd/MM/yyyy"
            minDate={baslangicTarihi}
            locale={tr}
          />
        </div>

        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Seçilen Tarih Aralığı: {baslangicTarihi.toLocaleDateString('tr-TR')} - {bitisTarihi.toLocaleDateString('tr-TR')}
          </p>
          <p className="text-sm font-medium text-gray-800 mt-1">
            Toplam İzin Günü: {calculateLeaveDays(baslangicTarihi, bitisTarihi)} gün
          </p>
        </div>

        {showError && (
          <div className="md:col-span-2">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {showError}
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            İzin Ekle
          </button>
        </div>
      </motion.form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İzin Türü
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlangıç
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bitiş
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gün
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usePersonelStore.getState().izinKayitlari.map((izin) => {
              const personel = personeller.find(p => p.id === izin.personelId);
              return (
                <tr key={izin.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {personel ? `${personel.ad} ${personel.soyad}` : 'Bilinmiyor'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {izin.izinTuru === 'yillik' ? 'Yıllık İzin' : 'Haftalık İzin'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(izin.baslangicTarihi).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(izin.bitisTarihi).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{izin.gun} gün</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IzinTakip;