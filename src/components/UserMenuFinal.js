import React, { useState } from 'react';

const UserMenuFinal = ({ onUserLogin, onAdminLogin, onRegister }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Acceso admin oculto
    if (credentials.email === 'admin@tienda.com' && 
        credentials.password === 'admin123') {
      onAdminLogin();
    } else {
      onUserLogin(credentials);
    }
  };

  return (
    <div className="user-menu-wrapper">
      <button onClick={() => setShowLogin(!showLogin)}>
        <UserIcon />
        <span>Mi Cuenta</span>
      </button>

      {showLogin && (
        <div className="login-dropdown">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
            <button type="submit">Ingresar</button>
          </form>
          <button onClick={onRegister}>Registrarse</button>
        </div>
      )}
    </div>
  );
};