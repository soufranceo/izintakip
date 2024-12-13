import React from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Button from '../components/Button';

export default function LeaveTracking() {
  const employees = useEmployeeStore((state) => state.employees);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">İzin Takip</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tüm personelin izin durumlarını görüntüleyebilirsiniz.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            İzin Kayıtları
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {employees.map((employee) => (
            <div key={employee.id} className="px-4 py-5 sm:p-6 border-b border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {employee.firstName} {employee.lastName}
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Haftalık İzin Hakkı</p>
                    <p className="font-medium">{employee.weeklyLeave} gün</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Yıllık İzin Hakkı</p>
                    <p className="font-medium">{employee.annualLeave} gün</p>
                  </div>
                </div>
                {employee.usedLeaves.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Başlangıç
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bitiş
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tür
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employee.usedLeaves.map((leave) => (
                        <tr key={leave.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(leave.startDate), 'dd MMMM yyyy', {
                              locale: tr,
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(leave.endDate), 'dd MMMM yyyy', {
                              locale: tr,
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {leave.type === 'WEEKLY' ? 'Haftalık' : 'Yıllık'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                leave.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-800'
                                  : leave.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {leave.status === 'APPROVED'
                                ? 'Onaylandı'
                                : leave.status === 'REJECTED'
                                ? 'Reddedildi'
                                : 'Beklemede'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">Henüz izin kaydı bulunmuyor.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}