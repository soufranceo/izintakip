import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, Home, LogOut, User } from 'lucide-react';
import { useEmployeeStore } from '../store/employeeStore';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const navigate = useNavigate();
  const logout = useEmployeeStore((state) => state.logout);
  const { currentUser, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">PersonelTakip</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ana Sayfa
                </Link>
                {isAdmin && (
                  <Link
                    to="/employees"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Personel Yönetimi
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/leaves"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    İzin Takip
                  </Link>
                )}
                {!isAdmin && (
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profilim
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}