import React, { useState } from 'react';

const UserAuth = ({ onLogin, onRegisterClick, user, onLogout, onViewOrders, unreadMessagesCount }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(credentials.email, credentials.password);
    if (success) {
      setShowDropdown(false);
      setShowLoginForm(false);
      setCredentials({ email: '', password: '' });
      setLoginError('');
    } else {
      const errorMessage = 'Correo o contraseña incorrectos.';
      setLoginError(errorMessage);
      alert('Error de inicio de sesión: ' + errorMessage); // Alerta nativa
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-gray-700 font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{user ? user.name : 'Mi cuenta'}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
          {user ? (
            <>
              <button 
                onClick={() => { onViewOrders(); setShowDropdown(false); }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Mis Pedidos
              </button>
              <button 
                onClick={() => { onLogout(); setShowDropdown(false); }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-1 pt-1"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              {!showLoginForm ? (
                <>
                  <button 
                    onClick={() => setShowLoginForm(true)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Iniciar sesión
                  </button>
                  <button 
                    onClick={() => { onRegisterClick(); setShowDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Registrarse
                  </button>
                </>
              ) : (
                <form onSubmit={handleLoginSubmit} className="px-4 py-2">
                  {loginError && <p className="text-red-500 text-sm mb-2">{loginError}</p>}
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-black"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-black"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors font-medium mb-2"
                  >
                    Ingresar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="text-sm text-gray-500 hover:text-black transition-colors"
                  >
                    ← Volver
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAuth;