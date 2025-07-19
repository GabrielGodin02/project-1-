import React, { useState } from 'react';

const RegistrationForm = ({ onRegister, onBack }) => {
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Account Info, 3: Verify Code
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    lastName: '',
    address: '',
    phone: '',
    paymentMethod: 'Efectivo' // Default a Efectivo
  });
  const [accountInfo, setAccountInfo] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [errors, setErrors] = useState({});

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleAccountInfoChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo({ ...accountInfo, [name]: value });
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    if (!personalInfo.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!personalInfo.lastName.trim()) newErrors.lastName = 'Apellido es requerido';
    if (!personalInfo.address.trim()) newErrors.address = 'Dirección es requerida';
    if (!personalInfo.phone.trim()) newErrors.phone = 'Teléfono es requerido';
    return newErrors;
  };

  const validateAccountInfo = () => {
    const newErrors = {};
    if (!accountInfo.email.trim()) newErrors.email = 'Correo es requerido';
    if (!/\S+@\S+\.\S+/.test(accountInfo.email)) newErrors.email = 'Correo inválido';
    if (!accountInfo.password.trim()) newErrors.password = 'Contraseña es requerida';
    if (accountInfo.password.length < 6) newErrors.password = 'Contraseña debe tener al menos 6 caracteres';
    if (accountInfo.password !== accountInfo.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    return newErrors;
  };

  const handleNextStep = () => {
    if (step === 1) {
      const personalErrors = validatePersonalInfo();
      if (Object.keys(personalErrors).length > 0) {
        setErrors(personalErrors);
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      const accountErrors = validateAccountInfo();
      if (Object.keys(accountErrors).length > 0) {
        setErrors(accountErrors);
        return;
      }
      setErrors({});
      // Simular envío de código
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
      setGeneratedCode(code);
      alert(`Código de verificación enviado a ${accountInfo.email} (simulado): ${code}`);
      setStep(3);
    }
  };

  const handleVerify = () => {
    if (verificationCode === generatedCode) {
      onRegister({ personalInfo, accountInfo }); // Pasar ambos objetos
      alert('¡Registro Exitoso! Tu cuenta ha sido creada con éxito.');
    } else {
      setErrors({ verificationCode: 'Código incorrecto' });
      alert('Error de Verificación: El código ingresado es incorrecto. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Registro de Cliente - Paso {step}</h2>
        
        {step === 1 && (
          <>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre*</label>
                <input
                  type="text"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Apellido*</label>
                <input
                  type="text"
                  name="lastName"
                  value={personalInfo.lastName}
                  onChange={handlePersonalInfoChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Dirección*</label>
              <input
                type="text"
                name="address"
                value={personalInfo.address}
                onChange={handlePersonalInfoChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
              />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Teléfono*</label>
              <input
                type="tel"
                name="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Método de Pago*</label>
              <select
                name="paymentMethod"
                value={personalInfo.paymentMethod}
                onChange={handlePersonalInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Siguiente
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Información de Cuenta</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Correo Electrónico*</label>
              <input
                type="email"
                name="email"
                value={accountInfo.email}
                onChange={handleAccountInfoChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Contraseña*</label>
              <input
                type="password"
                name="password"
                value={accountInfo.password}
                onChange={handleAccountInfoChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Confirmar Contraseña*</label>
              <input
                type="password"
                name="confirmPassword"
                value={accountInfo.confirmPassword}
                onChange={handleAccountInfoChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Enviar Código
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Verificación de Código</h3>
            <p className="text-gray-600 mb-4">Hemos enviado un código de 6 dígitos a {accountInfo.email}. Ingresa el código para verificar tu cuenta.</p>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Código de Verificación*</label>
              <input
                type="text"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.verificationCode ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
              />
              {errors.verificationCode && <p className="text-red-500 text-sm mt-1">{errors.verificationCode}</p>}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={handleVerify}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Verificar y Registrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;