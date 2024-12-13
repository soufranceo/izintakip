import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEmployeeStore } from '../store/employeeStore';
import Input from './Input';
import Button from './Button';
import { Leave } from '../types';

const leaveSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(['WEEKLY', 'ANNUAL']),
});

type LeaveForm = z.infer<typeof leaveSchema>;

export default function LeaveRequestForm() {
  const { currentUser, addLeave } = useEmployeeStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveForm>({
    resolver: zodResolver(leaveSchema),
  });

  if (!currentUser) {
    return null;
  }

  const onSubmit = (data: LeaveForm) => {
    const newLeave: Leave = {
      id: crypto.randomUUID(),
      employeeId: currentUser.id,
      startDate: data.startDate,
      endDate: data.endDate,
      type: data.type,
      status: 'PENDING',
    };
    addLeave(currentUser.id, newLeave);
    reset();
  };

  return (
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
      <Button type="submit">İzin Talebi Oluştur</Button>
    </form>
  );
}