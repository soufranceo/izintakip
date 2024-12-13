import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEmployeeStore } from '../store/employeeStore';
import Input from '../components/Input';
import Button from '../components/Button';
import { Employee, Leave } from '../types';
import { Edit2, Trash2, UserPlus, Calendar } from 'lucide-react';
import LeaveManagement from '../components/LeaveManagement';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  tcNo: z.string().length(11, 'TC Kimlik No 11 haneli olmalıdır'),
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  startDate: z.string(),
  weeklyLeave: z.number().min(0, 'Haftalık izin 0\'dan küçük olamaz'),
  annualLeave: z.number().min(0, 'Yıllık izin 0\'dan küçük olamaz'),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

export default function EmployeeManagement() {
  const { employees, addEmployee, removeEmployee, updateEmployee } = useEmployeeStore();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showLeaveManagement, setShowLeaveManagement] = useState(false);
  const currentUser = useEmployeeStore((state) => state.currentUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      weeklyLeave: 1,
      annualLeave: 14,
    },
  });

  const onSubmit = (data: EmployeeForm) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        ...data,
        usedLeaves: editingEmployee.usedLeaves,
      });
      setEditingEmployee(null);
    } else {
      const newEmployee: Employee = {
        ...data,
        id: crypto.randomUUID(),
        usedLeaves: [],
      };
      addEmployee(newEmployee);
    }
    reset();
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    Object.keys(employeeSchema.shape).forEach((key) => {
      setValue(key as keyof EmployeeForm, employee[key as keyof Employee]);
    });
  };

  const handleLeaveManagement = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowLeaveManagement(true);
  };

  const isAdmin = currentUser?.username === 'admin';

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personel Yönetimi</h2>
        <p className="mt-1 text-sm text-gray-500">
          Yeni personel ekleyebilir ve mevcut personeli yönetebilirsiniz.
        </p>
      </div>

      {showLeaveManagement && selectedEmployee ? (
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedEmployee.firstName} {selectedEmployee.lastName} - İzin Yönetimi
            </h3>
            <Button
              variant="secondary"
              onClick={() => {
                setShowLeaveManagement(false);
                setSelectedEmployee(null);
              }}
            >
              Geri Dön
            </Button>
          </div>
          <LeaveManagement employee={selectedEmployee} />
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <UserPlus className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEmployee ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Ad"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label="Soyad"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
              <Input
                label="Telefon"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <Input
                label="TC Kimlik No"
                {...register('tcNo')}
                error={errors.tcNo?.message}
              />
              <Input
                label="Kullanıcı Adı"
                {...register('username')}
                error={errors.username?.message}
              />
              <Input
                label="Şifre"
                type="password"
                {...register('password')}
                error={errors.password?.message}
              />
              <Input
                label="İşe Başlama Tarihi"
                type="date"
                {...register('startDate')}
                error={errors.startDate?.message}
              />
              <Input
                label="Haftalık İzin (Gün)"
                type="number"
                {...register('weeklyLeave', { valueAsNumber: true })}
                error={errors.weeklyLeave?.message}
              />
              <Input
                label="Yıllık İzin (Gün)"
                type="number"
                {...register('annualLeave', { valueAsNumber: true })}
                error={errors.annualLeave?.message}
              />
            </div>
            <div className="flex justify-end space-x-4">
              {editingEmployee && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingEmployee(null);
                    reset();
                  }}
                >
                  İptal
                </Button>
              )}
              <Button type="submit">
                {editingEmployee ? 'Güncelle' : 'Personel Ekle'}
              </Button>
            </div>
          </form>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Personel Listesi</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <li key={employee.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-blue-600">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{employee.username}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLeaveManagement(employee)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="İzin Yönetimi"
                      >
                        <Calendar className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeEmployee(employee.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}