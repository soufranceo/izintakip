import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEmployeeStore } from '../store/employeeStore';
import Input from './Input';
import Button from './Button';
import { Employee, Leave } from '../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const leaveSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(['WEEKLY', 'ANNUAL']),
});

type LeaveForm = z.infer<typeof leaveSchema>;

interface LeaveManagementProps {
  employee: Employee;
}

export default function LeaveManagement({ employee }: LeaveManagementProps) {
  const { addLeave, updateEmployee } = useEmployeeStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveForm>({
    resolver: zodResolver(leaveSchema),
  });

  const onSubmit = (data: LeaveForm) => {
    const newLeave: Leave = {
      id: crypto.randomUUID(),
      employeeId: employee.id,
      startDate: data.startDate,
      endDate: data.endDate,
      type: data.type,
      status: 'APPROVED', // Admin tarafından eklenen izinler otomatik onaylı
    };
    addLeave(employee.id, newLeave);
    reset();
  };

  const handleLeaveStatusChange = (leaveId: string, newStatus: Leave['status']) => {
    const updatedLeaves = employee.usedLeaves.map((leave) =>
      leave.id === leaveId ? { ...leave, status: newStatus } : leave
    );
    updateEmployee(employee.id, { usedLeaves: updatedLeaves });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Başlangıç Tarihi"
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
            <Input
              label="Bitiş Tarihi"
              type="date"
              {...register('endDate')}
              error={errors.endDate?.message}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İzin Türü
            </label>
            <select
              {...register('type')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="WEEKLY">Haftalık İzin</option>
              <option value="ANNUAL">Yıllık İzin</option>
            </select>
            {errors.type?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
          <Button type="submit">Yeni İzin Ekle</Button>
        </form>
      </div>

      <div className="bg-white rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4">İzin Geçmişi</h4>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {leave.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleLeaveStatusChange(leave.id, 'APPROVED')}
                        >
                          Onayla
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleLeaveStatusChange(leave.id, 'REJECTED')}
                        >
                          Reddet
                        </Button>
                      </div>
                    )}
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
  );
}