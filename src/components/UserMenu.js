import React, { useState } from 'react';

const UserMenu = ({ onLogin, onRegister, onAdminAccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('menu'); // menu | login | register
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (credentials.email === 'admin@tienda.com' && credentials.password === 'admin123') {
      onAdminAccess();
      setIsOpen(false);
    } else {
      onLogin(credentials);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Mi cuenta</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
          {view === 'menu' ? (
            <>
              <button 
                onClick={() => setView('login')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                Iniciar sesión
              </button>
              <button 
                onClick={() => setView('register')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                Registrarse
              </button>
            </>
          ) : view === 'login' ? (
            <form onSubmit={handleAdminLogin} className="px-4 py-2">
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-3 py-2 border rounded-md mb-2"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-3 py-2 border rounded-md mb-2"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 mb-2"
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => setView('menu')}
                className="text-sm text-gray-500 hover:text-black"
              >
                ← Volver
              </button>
            </form>
          ) : (
            <div className="px-4 py-2">
              {/* Formulario de registro */}
              <button
                onClick={() => setView('menu')}
                className="text-sm text-gray-500 hover:text-black mb-2"
              >
                ← Volver
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;