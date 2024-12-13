import React from 'react';
import { FileText, Calendar, User, Clock, CheckCircle } from 'lucide-react';
import { formatDateTR } from '../../utils/dateFormatters';
import { calculateLeaveDays } from '../../utils/leaveUtils';

interface PDFPreviewProps {
  selectedPersonel: string;
  izinTuru: 'yillik' | 'haftalik';
  izinBaslangic: Date;
  izinBitis: Date;
  mudurAdSoyad: string;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  selectedPersonel,
  izinTuru,
  izinBaslangic,
  izinBitis,
  mudurAdSoyad
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Belge Önizleme</h3>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-6">
          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
            <User className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500">Personel Bilgisi</p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedPersonel || '(Personel seçilmedi)'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500">İzin Türü</p>
              <p className="text-lg font-semibold text-gray-900">
                {izinTuru === 'yillik' ? 'Yıllık İzin' : 'Haftalık İzin'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500">İzin Tarihleri</p>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">
                  Başlangıç: {formatDateTR(izinBaslangic)}
                </p>
                <p className="font-medium text-gray-900">
                  Bitiş: {formatDateTR(izinBitis)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500">Toplam Süre</p>
              <p className="text-lg font-semibold text-gray-900">
                {calculateLeaveDays(izinBaslangic, izinBitis)} gün
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-lg">
            <CheckCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500">Onaylayan</p>
              <p className="text-lg font-semibold text-gray-900">
                {mudurAdSoyad || '(Müdür bilgisi girilmedi)'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 leading-relaxed">
              PDF belgesi, resmi izin formu formatında oluşturulacak ve tüm Türkçe karakterler doğru şekilde görüntülenecektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;