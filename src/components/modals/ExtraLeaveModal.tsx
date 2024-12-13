import React from 'react';
import { MIN_LEAVE_DAYS } from '../../utils/constants';

interface ExtraLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (days: number) => void;
  extraDays: number;
  setExtraDays: (days: number) => void;
}

const ExtraLeaveModal: React.FC<ExtraLeaveModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  extraDays,
  setExtraDays
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Ek İzin Hakkı Ekle</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Eklenecek İzin Günü
          </label>
          <input
            type="number"
            value={extraDays}
            onChange={(e) => setExtraDays(Number(e.target.value))}
            min={MIN_LEAVE_DAYS}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            İptal
          </button>
          <button
            onClick={() => onSubmit(extraDays)}
            disabled={extraDays < MIN_LEAVE_DAYS}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtraLeaveModal;