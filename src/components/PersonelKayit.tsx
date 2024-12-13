import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { usePersonelStore, Personel } from '../store/personelStore';
import { useAuthStore } from '../store/authStore';
import { Pencil, Trash2, X } from 'lucide-react';

function PersonelKayit() {
  const { addPersonel, updatePersonel, deletePersonel, personeller } = usePersonelStore();
  const { addUser, users, deleteUser } = useAuthStore();
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [telefon, setTelefon] = useState('');
  const [bolum, setBolum] = useState('');
  const [isGirisTarihi, setIsGirisTarihi] = useState<Date>(new Date());
  const [isCikisTarihi, setIsCikisTarihi] = useState<Date | null>(null);
  const [yillikIzin, setYillikIzin] = useState(14);
  const [haftalikIzin, setHaftalikIzin] = useState(2);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingPersonel, setEditingPersonel] = useState<Personel | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const yeniPersonel = {
      ad,
      soyad,
      tcNo,
      telefon,
      bolum,
      isGirisTarihi,
      isCikisTarihi,
      yillikIzin: Number(yillikIzin),
      haftalikIzin: Number(haftalikIzin),
    };

    if (editingPersonel) {
      updatePersonel(editingPersonel.id, yeniPersonel);
      setEditingPersonel(null);
    } else {
      const personelId = addPersonel(yeniPersonel);
      addUser({
        username,
        password,
        personelId,
        isAdmin: false
      });
    }
    
    resetForm();
  };

  const handleEdit = (personel: Personel) => {
    setEditingPersonel(personel);
    setAd(personel.ad);
    setSoyad(personel.soyad);
    setTcNo(personel.tcNo);
    setTelefon(personel.telefon);
    setBolum(personel.bolum);
    setIsGirisTarihi(new Date(personel.isGirisTarihi));
    setIsCikisTarihi(personel.isCikisTarihi ? new Date(personel.isCikisTarihi) : null);
    setYillikIzin(personel.yillikIzin);
    setHaftalikIzin(personel.haftalikIzin);
    
    const user = users.find(u => u.personelId === personel.id);
    if (user) {
      setUsername(user.username);
      setPassword(''); // Güvenlik için şifreyi gösterme
    }
  };

  const handleDelete = (personel: Personel) => {
    if (window.confirm(`${personel.ad} ${personel.soyad} personelini silmek istediğinize emin misiniz?`)) {
      deletePersonel(personel.id);
      const user = users.find(u => u.personelId === personel.id);
      if (user) {
        deleteUser(user.id);
      }
    }
  };

  const resetForm = () => {
    setAd('');
    setSoyad('');
    setTcNo('');
    setTelefon('');
    setBolum('');
    setIsGirisTarihi(new Date());
    setIsCikisTarihi(null);
    setYillikIzin(14);
    setHaftalikIzin(2);
    setUsername('');
    setPassword('');
    setEditingPersonel(null);
  };

  return (
    <div className="space-y-8">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {editingPersonel ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
          </h2>
          {editingPersonel && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
              İptal
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ad
          </label>
          <input
            type="text"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Soyad
          </label>
          <input
            type="text"
            value={soyad}
            onChange={(e) => setSoyad(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TC No
          </label>
          <input
            type="text"
            value={tcNo}
            onChange={(e) => setTcNo(e.target.value)}
            maxLength={11}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefon
          </label>
          <input
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bölüm
          </label>
          <input
            type="text"
            value={bolum}
            onChange={(e) => setBolum(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İş Giriş Tarihi
          </label>
          <DatePicker
            selected={isGirisTarihi}
            onChange={(date: Date) => setIsGirisTarihi(date)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İş Çıkış Tarihi
          </label>
          <DatePicker
            selected={isCikisTarihi}
            onChange={(date: Date | null) => setIsCikisTarihi(date)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dateFormat="dd/MM/yyyy"
            isClearable
            placeholderText="Çıkış tarihi seçin"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yıllık İzin (Gün)
          </label>
          <input
            type="number"
            value={yillikIzin}
            onChange={(e) => setYillikIzin(Number(e.target.value))}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Haftalık İzin (Gün)
          </label>
          <input
            type="number"
            value={haftalikIzin}
            onChange={(e) => setHaftalikIzin(Number(e.target.value))}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {!editingPersonel && (
          <div className="bg-blue-50 p-4 rounded-lg md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Kullanıcı Hesabı Oluştur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={!editingPersonel}
                />
              </div>
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingPersonel ? 'Personel Bilgilerini Güncelle' : 'Personel Ekle'}
          </button>
        </div>
      </motion.form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad Soyad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TC No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bölüm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İş Giriş
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yıllık İzin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Haftalık İzin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {personeller.map((personel) => {
              const kalanYillikIzin = usePersonelStore.getState().getKalanIzin(personel.id, 'yillik');
              const kalanHaftalikIzin = usePersonelStore.getState().getKalanIzin(personel.id, 'haftalik');
              const user = users.find(u => u.personelId === personel.id);
              
              return (
                <tr key={personel.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {personel.ad} {personel.soyad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{personel.tcNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{personel.telefon}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{personel.bolum}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(personel.isGirisTarihi).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {kalanYillikIzin}/{personel.yillikIzin} gün
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {kalanHaftalikIzin}/{personel.haftalikIzin} gün
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user?.username || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(personel)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(personel)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PersonelKayit;