import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee, Leave } from '../types';
import { adminUser } from '../utils/initialData';

interface EmployeeStore {
  employees: Employee[];
  currentUser: Employee | null;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  addLeave: (employeeId: string, leave: Leave) => void;
  login: (username: string, password: string) => Employee | null;
  logout: () => void;
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: [adminUser],
      currentUser: null,
      addEmployee: (employee) =>
        set((state) => ({ employees: [...state.employees, employee] })),
      updateEmployee: (id, updatedEmployee) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updatedEmployee } : emp
          ),
        })),
      removeEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        })),
      addLeave: (employeeId, leave) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, usedLeaves: [...emp.usedLeaves, leave] }
              : emp
          ),
          currentUser: state.currentUser?.id === employeeId
            ? { ...state.currentUser, usedLeaves: [...state.currentUser.usedLeaves, leave] }
            : state.currentUser,
        })),
      login: (username, password) => {
        const employee = get().employees.find(
          (emp) => emp.username === username && emp.password === password
        );
        if (employee) {
          set({ currentUser: employee });
          return employee;
        }
        return null;
      },
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'employee-storage',
    }
  )
);