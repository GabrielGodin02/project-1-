import React, { useState } from 'react';

const UserDropdown = ({ onLogin, onRegister, onAdminAccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // Credenciales admin hardcodeadas
    if (credentials.email === 'admin@tienda.com' && credentials.password === 'admin123') {
      onAdminAccess();
    } else {
      onLogin(credentials);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Mi cuenta</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
          {!showLogin ? (
            <>
              <button 
                onClick={() => setShowLogin(true)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar sesión
              </button>
              <button 
                onClick={onRegister}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Registrarse
              </button>
            </>
          ) : (
            <form onSubmit={handleLogin} className="px-4 py-2">
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="w-full px-3 py-2 border rounded-md"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full px-3 py-2 border rounded-md"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="mt-2 text-sm text-gray-500 hover:text-black"
              >
                Volver
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;