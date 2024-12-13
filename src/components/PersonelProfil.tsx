import React from 'react';
import { motion } from 'framer-motion';
import { usePersonelStore } from '../store/personelStore';
import { useIzinTalepStore } from '../store/izinTalepStore';
import { useAuthStore } from '../store/authStore';
import DatePicker from 'react-datepicker';
import { differenceInDays } from 'date-fns';

function PersonelProfil() {
  const { currentUser } = useAuthStore();
  const { personeller, getKalanIzin } = usePersonelStore();
  const { talepler, addTalep } = useIzinTalepStore();
  const [baslangicTarihi, setBaslangicTarihi] = React.useState<Date>(new Date());
  const [bitisTarihi, setBitisTarihi] = React.useState<Date>(new Date());
  const [izinTuru, setIzinTuru] = React.useState<'yillik' | 'haftalik'>('yillik');
  const [aciklama, setAciklama] = React.useState('');

  if (!currentUser) return null;

  const personel = personeller.find(p => p.id === currentUser.personelId);
  if (!personel) return null;

  const handleIzinTalep = (e: React.FormEvent) => {
    e.preventDefault();
    const gun = differenceInDays(bitisTarihi, baslangicTarihi) + 1;
    
    addTalep({
      personelId: personel.id,
      baslangicTarihi,
      bitisTarihi,
      izinTuru,
      gun,
      aciklama
    });

    setAciklama('');
    setBaslangicTarihi(new Date());
    setBitisTarihi(new Date());
  };

  const personelTalepler = talepler.filter(t => t.personelId === personel.id);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Personel Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600">Ad Soyad</p>
            <p className="font-semibold">{personel.ad} {personel.soyad}</p>
          </div>
          <div>
            <p className="text-gray-600">TC No</p>
            <p className="font-semibold">{personel.tcNo}</p>
          </div>
          <div>
            <p className="text-gray-600">Telefon</p>
            <p className="font-semibold">{personel.telefon}</p>
          </div>
          <div>
            <p className="text-gray-600">Bölüm</p>
            <p className="font-semibold">{personel.bolum}</p>
          </div>
          <div>
            <p className="text-gray-600">İşe Giriş Tarihi</p>
            <p className="font-semibold">{new Date(personel.isGirisTarihi).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Kalan İzinler</p>
            <p className="font-semibold">
              Yıllık: {getKalanIzin(personel.id, 'yillik')} gün |
              Haftalık: {getKalanIzin(personel.id, 'haftalik')} gün
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6">İzin Talebi</h2>
        <form onSubmit={handleIzinTalep} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Başlangıç Tarihi
              </label>
              <DatePicker
                selected={baslangicTarihi}
                onChange={(date: Date) => setBaslangicTarihi(date)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dateFormat="dd/MM/yyyy"
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
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            İzin Talebi Gönder
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6">İzin Talep Geçmişi</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih Aralığı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İzin Türü
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {personelTalepler.map((talep) => (
                <tr key={talep.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(talep.baslangicTarihi).toLocaleDateString()} -
                    {new Date(talep.bitisTarihi).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {talep.izinTuru === 'yillik' ? 'Yıllık İzin' : 'Haftalık İzin'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {talep.gun} gün
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${talep.durum === 'onaylandi' ? 'bg-green-100 text-green-800' :
                        talep.durum === 'reddedildi' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {talep.durum === 'onaylandi' ? 'Onaylandı' :
                        talep.durum === 'reddedildi' ? 'Reddedildi' : 'Beklemede'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default PersonelProfil;