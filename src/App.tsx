import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Calendar, FileText, User } from 'lucide-react';
import Login from './components/Login';
import PersonelKayit from './components/PersonelKayit';
import IzinTakip from './components/IzinTakip';
import IzinBelgesi from './components/IzinBelgesi';
import PersonelProfil from './components/PersonelProfil';
import IzinTalepYonetimi from './components/IzinTalepYonetimi';
import { useAuthStore } from './store/authStore';

function App() {
  const { currentUser, logout } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('personel');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!currentUser);
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-4xl font-bold text-center"
        >
          Personel Online İzin Takip<br />
          Sistemi
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const isAdmin = currentUser?.isAdmin;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Personel Online İzin Takip</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {isAdmin ? 'Admin Panel' : 'Personel Panel'}
            </span>
            <button
              onClick={() => {
                logout();
                setIsAuthenticated(false);
              }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {isAdmin ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('personel')}
                className={`p-6 rounded-xl flex flex-col items-center gap-3 ${
                  activeTab === 'personel'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                } shadow-lg transition-colors`}
              >
                <UserPlus size={24} />
                <span className="font-medium">Personel Kayıt</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('izin')}
                className={`p-6 rounded-xl flex flex-col items-center gap-3 ${
                  activeTab === 'izin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                } shadow-lg transition-colors`}
              >
                <Calendar size={24} />
                <span className="font-medium">İzin Takip</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('belge')}
                className={`p-6 rounded-xl flex flex-col items-center gap-3 ${
                  activeTab === 'belge'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                } shadow-lg transition-colors`}
              >
                <FileText size={24} />
                <span className="font-medium">İzin Belgesi</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('talepler')}
                className={`p-6 rounded-xl flex flex-col items-center gap-3 ${
                  activeTab === 'talepler'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                } shadow-lg transition-colors`}
              >
                <Calendar size={24} />
                <span className="font-medium">İzin Talepleri</span>
              </motion.button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              {activeTab === 'personel' && <PersonelKayit />}
              {activeTab === 'izin' && <IzinTakip />}
              {activeTab === 'belge' && <IzinBelgesi />}
              {activeTab === 'talepler' && <IzinTalepYonetimi />}
            </div>
          </>
        ) : (
          <PersonelProfil />
        )}
      </div>
    </div>
  );
}

export default App;