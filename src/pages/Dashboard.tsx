import React, { useState } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { format, addDays, isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const employees = useEmployeeStore((state) => state.employees);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const today = new Date();

  const onLeaveToday = employees.filter((emp) =>
    emp.usedLeaves.some(
      (leave) =>
        new Date(leave.startDate) <= today && 
        new Date(leave.endDate) >= today &&
        leave.status === 'APPROVED'
    )
  );

  const upcomingLeaves = employees.filter((emp) =>
    emp.usedLeaves.some((leave) => {
      const startDate = new Date(leave.startDate);
      return (
        startDate > today &&
        startDate <= addDays(today, 7) &&
        (leave.status === 'PENDING' || leave.status === 'APPROVED')
      );
    })
  );

  const activeEmployees = employees.filter(
    (emp) => !emp.endDate && !onLeaveToday.includes(emp)
  );

  const handleLeaveAction = (employeeId: string, leaveId: string, status: 'APPROVED' | 'REJECTED') => {
    const { updateEmployee } = useEmployeeStore.getState();
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const updatedLeaves = employee.usedLeaves.map(leave =>
        leave.id === leaveId ? { ...leave, status } : leave
      );
      updateEmployee(employeeId, { usedLeaves: updatedLeaves });
    }
  };

  const renderEmployeeList = (title: string, employees: typeof onLeaveToday) => (
    <div className="mt-4 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {employees.length > 0 ? (
        <ul className="space-y-4">
          {employees.map((emp) => (
            <li key={emp.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {emp.firstName} {emp.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{emp.phone}</p>
                </div>
              </div>
              {selectedSection === 'upcoming' && (
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <p className="text-sm font-medium text-gray-900 mb-2">İzin Talepleri:</p>
                  {emp.usedLeaves
                    .filter(leave => {
                      const startDate = new Date(leave.startDate);
                      return startDate > today && startDate <= addDays(today, 7);
                    })
                    .map(leave => (
                      <div key={leave.id} className="bg-white p-3 rounded-md shadow-sm mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            {format(new Date(leave.startDate), 'dd MMMM yyyy', { locale: tr })} - 
                            {format(new Date(leave.endDate), 'dd MMMM yyyy', { locale: tr })}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            leave.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : leave.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status === 'APPROVED'
                              ? 'Onaylandı'
                              : leave.status === 'REJECTED'
                              ? 'Reddedildi'
                              : 'Beklemede'}
                          </span>
                        </div>
                        {isAdmin && leave.status === 'PENDING' && (
                          <div className="flex space-x-2 mt-2">
                            <Button
                              size="sm"
                              onClick={() => handleLeaveAction(emp.id, leave.id, 'APPROVED')}
                            >
                              Onayla
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleLeaveAction(emp.id, leave.id, 'REJECTED')}
                            >
                              Reddet
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Kayıt bulunamadı.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Genel Durum</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <button
          onClick={() => setSelectedSection(selectedSection === 'active' ? null : 'active')}
          className="bg-blue-50 overflow-hidden shadow rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-blue-800 truncate">
              Çalışan Personel
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-900">
              {activeEmployees.length}
            </dd>
          </div>
        </button>

        <button
          onClick={() => setSelectedSection(selectedSection === 'onLeave' ? null : 'onLeave')}
          className="bg-green-50 overflow-hidden shadow rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
        >
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-green-800 truncate">
              İzindeki Personel
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-green-900">
              {onLeaveToday.length}
            </dd>
          </div>
        </button>

        <button
          onClick={() => setSelectedSection(selectedSection === 'upcoming' ? null : 'upcoming')}
          className="bg-yellow-50 overflow-hidden shadow rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
        >
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-yellow-800 truncate">
              Yaklaşan İzinler ve Talepler
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-900">
              {upcomingLeaves.length}
            </dd>
          </div>
        </button>
      </div>

      {selectedSection === 'active' && renderEmployeeList('Aktif Çalışan Personel', activeEmployees)}
      {selectedSection === 'onLeave' && renderEmployeeList('İzindeki Personel', onLeaveToday)}
      {selectedSection === 'upcoming' && renderEmployeeList('Yaklaşan İzinler ve Talepler', upcomingLeaves)}
    </div>
  );
}