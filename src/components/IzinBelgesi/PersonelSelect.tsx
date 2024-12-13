import React from 'react';
import { Personel } from '../../store/personelStore';

interface PersonelSelectProps {
  selectedPersonel: string;
  onSelect: (value: string) => void;
  personeller: Personel[];
}

const PersonelSelect: React.FC<PersonelSelectProps> = ({
  selectedPersonel,
  onSelect,
  personeller
}) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Personel Seçimi
      </label>
      <select
        value={selectedPersonel}
        onChange={(e) => onSelect(e.target.value)}
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
  );
};

export default PersonelSelect;