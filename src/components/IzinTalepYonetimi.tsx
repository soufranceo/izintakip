import React from 'react';
import { motion } from 'framer-motion';
import { useIzinTalepStore } from '../store/izinTalepStore';
import { usePersonelStore } from '../store/personelStore';

function IzinTalepYonetimi() {
  const { talepler, updateTalepDurum } = useIzinTalepStore();
  const { personeller } = usePersonelStore();

  const bekleyenTalepler = talepler.filter(t => t.durum === 'beklemede');

  const handleTalepGuncelle = (id: number, durum: 'onaylandi' | 'reddedildi') => {
    updateTalepDurum(id, durum);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">İzin Talep Yönetimi</h2>
      
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
                Tarih Aralığı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gün
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Açıklama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bekleyenTalepler.map((talep) => {
              const personel = personeller.find(p => p.id === talep.personelId);
              return (
                <tr key={talep.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {personel ? `${personel.ad} ${personel.soyad}` : 'Bilinmiyor'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {talep.izinTuru === 'yillik' ? 'Yıllık İzin' : 'Haftalık İzin'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(talep.baslangicTarihi).toLocaleDateString()} -
                    {new Date(talep.bitisTarihi).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {talep.gun} gün
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {talep.aciklama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleTalepGuncelle(talep.id, 'onaylandi')}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={() => handleTalepGuncelle(talep.id, 'reddedildi')}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      Reddet
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default IzinTalepYonetimi;