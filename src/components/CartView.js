import React from 'react';

const CartView = ({ cart, onUpdateCart, onPlaceOrder, onBack }) => {
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuantityChange = (id, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return {
          ...item,
          quantity: newQuantity > 0 ? newQuantity : 1
        };
      }
      return item;
    });
    onUpdateCart(updatedCart);
  };

  const handleRemove = (id) => {
    onUpdateCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Tu Carrito de Compras</h1>
            <button 
              onClick={onBack}
              className="text-gray-500 hover:text-black transition-colors font-medium"
            >
              ← Volver a productos
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <button
                onClick={onBack}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {cart.map(item => (
                  <div key={item.id} className="py-4 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-gray-500 text-sm">${item.price.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-l-md transition-colors text-gray-700"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-50 text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-r-md transition-colors text-gray-700"
                      >
                        +
                      </button>
                      <span className="ml-6 w-20 text-right font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={onPlaceOrder}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Realizar Pedido
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartView;