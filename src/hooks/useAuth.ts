import { useEmployeeStore } from '../store/employeeStore';

export function useAuth() {
  const currentUser = useEmployeeStore((state) => state.currentUser);
  
  return {
    isAdmin: currentUser?.username === 'admin',
    isAuthenticated: !!currentUser,
    currentUser,
  };
}