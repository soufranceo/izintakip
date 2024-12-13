import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import LeaveTracking from './pages/LeaveTracking';
import Login from './pages/Login';
import EmployeeProfile from './pages/EmployeeProfile';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute requireAdmin>
                <EmployeeManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaves" 
            element={
              <ProtectedRoute requireAdmin>
                <LeaveTracking />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile" element={<EmployeeProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}