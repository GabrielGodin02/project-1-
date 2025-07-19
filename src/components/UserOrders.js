import React, { useState, useEffect } from 'react';

const UserOrders = ({ user, orders, onCancelOrder, onBack, onConfirmOrder, onOpenChatForOrder }) => {
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    if (user && orders) {
      setUserOrders(orders.filter(order => order.user.email === user.email));
    }
  }, [user, orders]);

  const calculateTimeLeft = (orderTime) => {
    const placedTime = new Date(orderTime).getTime();
    const oneHour = 1 * 60 * 60 * 1000; // 1 hora en milisegundos
    const endTime = placedTime + oneHour;
    const now = Date.now();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      return { canCancel: false, message: "Tiempo de cancelación expirado" };
    }

    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60); // Agregamos segundos para mayor precisión
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);

    const messageText = `Tiempo restante para cancelar: ${hours}h ${minutes}m ${seconds}s`; // Nueva variable
    return { canCancel: true, message: messageText };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
            <button 
              onClick={onBack}
              className="text-gray-500 hover:text-black transition-colors font-medium"
            >
              ← Volver a la tienda
            </button>
          </div>

          {userOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No tienes pedidos realizados aún.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map(order => {
                const timeLeftData = calculateTimeLeft(order.orderTime); // Usar una nueva variable
                return (
                  <div key={order.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">Pedido #{order.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Total: ${order.total.toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">Fecha: {new Date(order.orderTime).toLocaleString()}</p>
                    <ul className="list-disc list-inside text-gray-600 text-sm mt-2">
                      {order.items.map(item => (
                        <li key={item.id}>{item.name} x {item.quantity} (${item.price.toFixed(2)} c/u)</li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      {order.status === 'pending' && (
                        <>
                          <p className="text-gray-600 text-sm mb-2">{timeLeftData.message}</p>
                          {timeLeftData.canCancel && (
                            <button
                              onClick={() => onCancelOrder(order.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors font-medium mr-2"
                            >
                              Cancelar Pedido
                            </button>
                          )}
                          <button
                            onClick={() => onConfirmOrder(order.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors font-medium"
                          >
                            Confirmar Ahora
                          </button>
                        </>
                      )}
                      {order.status !== 'pending' && order.status !== 'cancelled' && order.status !== 'rejected' && (
                        <p className="text-gray-600 text-sm mt-2">Estado del pedido: <span className="font-semibold">{order.status.replace(/_/g, ' ').toUpperCase()}</span></p>
                      )}
                      <button
                        onClick={() => onOpenChatForOrder(order.id)}
                        className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors font-medium mt-2"
                      >
                        Chat sobre Pedido
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;