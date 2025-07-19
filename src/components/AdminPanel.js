import React, { useState, useEffect } from 'react';

const AdminPanel = ({ products, onAddProduct, onUpdateProduct, onRemoveProduct, onLogout, orders, onUpdateOrder, chats, onSendMessage, onMarkMessagesRead }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    image: '' // Ahora guarda la URL base64
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'stats', 'chat'
  const [selectedUserChat, setSelectedUserChat] = useState(null);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
        stock: editingProduct.stock,
        image: editingProduct.image
      });
    } else {
      setFormData({ name: '', price: '', description: '', stock: '', image: '' });
    }
    setErrors({});
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // Guarda la imagen como base64
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) newErrors.price = 'Precio debe ser un número positivo';
    if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) newErrors.stock = 'Stock debe ser un número no negativo';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      id: editingProduct ? editingProduct.id : Date.now()
    };

    if (editingProduct) {
      onUpdateProduct(productData);
      alert('Producto actualizado con éxito.');
    } else {
      onAddProduct(productData);
      alert('Producto agregado con éxito.');
    }
    setEditingProduct(null);
    setFormData({ name: '', price: '', description: '', stock: '', image: '' });
  };

  const handleRemoveProduct = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      onRemoveProduct(productId);
      alert('Producto eliminado con éxito.');
    }
  };

  const calculateStats = () => {
    let totalRevenue = 0;
    let totalProductsSold = 0;
    const productSales = {}; // {productId: {name, quantitySold, revenue}}

    orders.forEach(order => {
      if (order.status === 'accepted') {
        order.items.forEach(item => {
          totalRevenue += item.price * item.quantity;
          totalProductsSold += item.quantity;

          if (!productSales[item.id]) {
            productSales[item.id] = { name: item.name, quantitySold: 0, revenue: 0 };
          }
          productSales[item.id].quantitySold += item.quantity;
          productSales[item.id].revenue += item.price * item.quantity;
        });
      }
    });

    const currentStock = products.reduce((acc, product) => {
      acc[product.id] = { name: product.name, stock: product.stock };
      return acc;
    }, {});

    return { totalRevenue, totalProductsSold, productSales, currentStock };
  };

  const stats = calculateStats();

  const handleSendChatMessage = () => {
    if (chatMessage.trim() && selectedUserChat) {
      onSendMessage(selectedUserChat, chatMessage, 'admin');
      setChatMessage('');
    }
  };

  const handleSelectUserChat = (chatKey) => {
    setSelectedUserChat(chatKey);
    onMarkMessagesRead(chatKey, 'admin'); // Marcar mensajes como leídos por el admin
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="mb-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 text-lg font-medium ${activeTab === 'products' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 text-lg font-medium ${activeTab === 'orders' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-4 text-lg font-medium ${activeTab === 'stats' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Estadísticas
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2 px-4 text-lg font-medium ${activeTab === 'chat' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Chat
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Productos Existentes</h2>
                  <div className="space-y-4">
                    {products.map(product => (
                      <div key={product.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-contain mr-4 rounded" />
                          )}
                          <div>
                            <h3 className="font-medium text-gray-800">{product.name}</h3>
                            <p className="text-gray-500 text-sm">${product.price.toFixed(2)} | Stock: {product.stock}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Nombre*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Precio*</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
                      />
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Descripción</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Stock*</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors.stock ? 'border-red-500 ring-red-200' : 'focus:ring-black'}`}
                      />
                      {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Imagen</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-gray-700"
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <img src={formData.image} alt="Preview" className="w-24 h-24 object-contain border rounded" />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      {editingProduct && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Pedidos Pendientes</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">No hay pedidos pendientes.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
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
                    <p className="text-gray-600 text-sm">Cliente: {order.user.name} ({order.user.email})</p>
                    <p className="text-gray-600 text-sm">Teléfono: {order.user.phone}</p>
                    <p className="text-gray-600 text-sm">Dirección: {order.user.address}</p>
                    <p className="text-gray-600 text-sm">Método de Pago: {order.user.paymentMethod}</p>
                    <p className="text-gray-600 text-sm">Total: ${order.total.toFixed(2)}</p>
                    <ul className="list-disc list-inside text-gray-600 text-sm mt-2">
                      {order.items.map(item => (
                        <li key={item.id}>{item.name} x {item.quantity} (${item.price.toFixed(2)} c/u)</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2"> {/* Usar flex-wrap para que los botones no se salgan */}
                      {/* Botones de Aceptar/Rechazar solo si está pendiente */}
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onUpdateOrder(order.id, 'accepted')}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors font-medium"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => onUpdateOrder(order.id, 'rejected')}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors font-medium"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {/* Opciones de seguimiento siempre visibles si el pedido no está rechazado o cancelado */}
                      {order.status !== 'rejected' && order.status !== 'cancelled' && (
                        <>
                          <button
                            onClick={() => onUpdateOrder(order.id, 'preparing')}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors font-medium"
                          >
                            Preparando
                          </button>
                          <button
                            onClick={() => onUpdateOrder(order.id, 'ready')}
                            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors font-medium"
                          >
                            Listo para salir
                          </button>
                          <button
                            onClick={() => onUpdateOrder(order.id, 'on_the_way')}
                            className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition-colors font-medium"
                          >
                            En camino
                          </button>
                          <button
                            onClick={() => onUpdateOrder(order.id, 'delivered')}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors font-medium"
                          >
                            Entregado
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Estadísticas Generales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-800">Ganancias Totales (Pedidos Aceptados)</h3>
                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-800">Productos Vendidos (Unidades)</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalProductsSold}</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-900">Stock Actual por Producto</h2>
            <div className="space-y-2">
              {Object.values(stats.currentStock).map(product => (
                <div key={product.name} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <span className="text-gray-800">{product.name}</span>
                  <span className="font-medium text-gray-900">{product.stock} unidades</span>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-900">Detalle de Ventas por Producto</h2>
            {Object.keys(stats.productSales).length === 0 ? (
              <p className="text-gray-500">No hay ventas registradas aún.</p>
            ) : (
              <div className="space-y-2">
                {Object.values(stats.productSales).map(product => (
                  <div key={product.name} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 text-sm">Unidades vendidas: {product.quantitySold}</p>
                    <p className="text-gray-600 text-sm">Ganancia: ${product.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Chats con Usuarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 border-r border-gray-200 pr-4">
                <h3 className="font-medium text-gray-800 mb-2">Usuarios</h3>
                {Object.keys(chats).length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay chats iniciados.</p>
                ) : (
                  <ul className="space-y-2">
                    {Object.keys(chats).map(chatKey => {
                      // Asumiendo que chatKey es 'order_ID' o 'userEmail'
                      const isOrderChat = chatKey.startsWith('order_');
                      const orderId = isOrderChat ? parseInt(chatKey.split('_')[1]) : null;
                      const order = orderId ? orders.find(o => o.id === orderId) : null;
                      const displayIdentifier = isOrderChat ? `Pedido #${orderId} (${order ? order.user.name : 'Desconocido'})` : chatKey;
                      const unread = chats[chatKey].filter(msg => msg.sender !== 'admin' && !msg.readByAdmin).length;
                      
                      return (
                        <li key={chatKey}>
                          <button
                            onClick={() => handleSelectUserChat(chatKey)}
                            className={`w-full text-left px-3 py-2 rounded-lg relative ${selectedUserChat === chatKey ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'}`}
                          >
                            {displayIdentifier}
                            {unread > 0 && (
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {unread}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="md:col-span-2 pl-4">
                {selectedUserChat ? (
                  <div className="flex flex-col h-96 border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-medium text-gray-800">Chat con {selectedUserChat.startsWith('order_') ? `Pedido #${selectedUserChat.split('_')[1]}` : selectedUserChat}</h3>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto space-y-3">
                      {chats[selectedUserChat].map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <span className="text-xs opacity-75 block text-right">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
                        placeholder="Escribe un mensaje..."
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Selecciona un usuario para chatear.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;