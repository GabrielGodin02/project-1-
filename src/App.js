import React, { useState, useEffect } from 'react';
import ProductGrid from './components/ProductGrid';
import CartView from './components/CartView';
import AdminPanel from './components/AdminPanel';
import RegistrationForm from './components/RegistrationForm';
import UserAuth from './components/UserAuth';
import UserOrders from './components/UserOrders';
import ChatWindow from './components/ChatWindow';
import DEFAULT_PRODUCTS from './mock/products';

export default function App() {
  const [currentView, setCurrentView] = useState('products'); // 'products', 'cart', 'register', 'admin', 'checkout', 'userOrders', 'chat'
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // Para el usuario logueado
  const [isAdmin, setIsAdmin] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('registered-users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('store-products');
    return savedProducts ? JSON.parse(savedProducts) : DEFAULT_PRODUCTS;
  });
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('store-orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('store-chats');
    return savedChats ? JSON.parse(savedChats) : {};
  });
  const [activeChatUserEmail, setActiveChatUserEmail] = useState(null); // Email del usuario con chat activo
  const [activeChatOrderId, setActiveChatOrderId] = useState(null); // ID del pedido con chat activo

  // Persistir datos en localStorage
  useEffect(() => {
    localStorage.setItem('store-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('store-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('store-chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('registered-users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Funciones de productos (para AdminPanel)
  const handleAddProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const handleRemoveProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  // Funciones del carrito
  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  // Funciones de pedidos
  const placeOrder = () => {
    if (!user) {
      alert('Necesitas una cuenta. Por favor, inicia sesión o regístrate para realizar un pedido.');
      setCurrentView('register'); // Redirigir a registro si no hay usuario
      return;
    }

    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de realizar un pedido.');
      return;
    }

    const newOrder = {
      id: Date.now(),
      user: { 
        email: user.email, 
        name: user.name, 
        address: user.address, 
        phone: user.phone, 
        paymentMethod: user.paymentMethod 
      },
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pending', // 'pending', 'accepted', 'rejected', 'cancelled', 'preparing', 'ready', 'on_the_way', 'delivered'
      orderTime: new Date().toISOString(),
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    setCart([]); // Vaciar carrito después de realizar el pedido
    setCurrentView('userOrders'); // Llevar al usuario a ver sus pedidos
    alert('Pedido realizado con éxito. Tienes 1 hora para cancelarlo.');

    // Actualizar stock de productos
    setProducts(prevProducts => 
      prevProducts.map(p => {
        const orderedItem = cart.find(item => item.id === p.id);
        if (orderedItem) {
          return { ...p, stock: p.stock - orderedItem.quantity };
        }
        return p;
      })
    );
  };

  const handleUpdateOrder = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    alert(`El pedido #${orderId} ahora está en estado: ${newStatus.replace(/_/g, ' ').toUpperCase()}`);
  };

  const handleCancelOrder = (orderId) => {
    const orderToCancel = orders.find(order => order.id === orderId);
    if (orderToCancel && orderToCancel.status === 'pending') {
      const placedTime = new Date(orderToCancel.orderTime).getTime();
      const oneHour = 1 * 60 * 60 * 1000;
      const endTime = placedTime + oneHour;
      const now = Date.now();

      if (now < endTime) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
        // Devolver stock al cancelar
        setProducts(prevProducts => 
          prevProducts.map(p => {
            const cancelledItem = orderToCancel.items.find(item => item.id === p.id);
            if (cancelledItem) {
              return { ...p, stock: p.stock + cancelledItem.quantity };
            }
            return p;
          })
        );
        alert('Pedido cancelado con éxito.');
      } else {
        alert('El tiempo para cancelar este pedido ha expirado.');
      }
    } else {
      alert('Este pedido no puede ser cancelado.');
    }
  };

  const handleConfirmOrderNow = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'accepted' } : order
      )
    );
    alert('Pedido confirmado. ¡Gracias por tu confianza!');
  };

  // Funciones de autenticación/registro
  const handleUserLogin = (email, password) => {
    // Credenciales de admin
    if (email === 'admin@gmail.com' && password === 'admin0240') { 
      setIsAdmin(true);
      setCurrentView('admin');
      return true;
    }

    // Buscar usuario registrado
    const foundUser = registeredUsers.find(u => u.accountInfo.email === email && u.accountInfo.password === password);
    if (foundUser) {
      setUser({ 
        email: foundUser.accountInfo.email, 
        name: foundUser.personalInfo.name,
        address: foundUser.personalInfo.address,
        phone: foundUser.personalInfo.phone,
        paymentMethod: foundUser.personalInfo.paymentMethod
      }); 
      setCurrentView('products');
      alert(`Bienvenido, ${foundUser.personalInfo.name}!`);
      return true;
    } else {
      return false; // Login fallido
    }
  };

  const handleRegister = (userData) => {
    // Verificar si el correo ya está registrado
    const isEmailTaken = registeredUsers.some(u => u.accountInfo.email === userData.accountInfo.email);
    if (isEmailTaken) {
      alert('Este correo ya está registrado. Por favor, inicia sesión o usa otro correo.');
      return;
    }

    setRegisteredUsers(prevUsers => [...prevUsers, userData]);
    setUser({ 
      email: userData.accountInfo.email, 
      name: userData.personalInfo.name,
      address: userData.personalInfo.address,
      phone: userData.personalInfo.phone,
      paymentMethod: userData.personalInfo.paymentMethod
    }); 
    setCurrentView('products'); // Después de registrarse, vuelve a productos
    alert(`Registro exitoso, ${userData.personalInfo.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentView('products');
    setCart([]); // Limpiar carrito al cerrar sesión
    alert('Has cerrado sesión correctamente.');
  };

  // Funciones de Chat
  const handleSendMessage = (targetEmail, text, sender, orderId = null) => {
    setChats(prevChats => {
      const newChats = { ...prevChats };
      const chatKey = orderId ? `order_${orderId}` : targetEmail;

      if (!newChats[chatKey]) {
        newChats[chatKey] = [];
      }
      newChats[chatKey].push({ 
        text, 
        sender, 
        timestamp: new Date().toISOString(), 
        readByAdmin: sender === 'admin', 
        readByUser: sender === 'user' 
      });
      return newChats;
    });
  };

  const handleMarkMessagesRead = (chatKey, readerType) => {
    setChats(prevChats => {
      const newChats = { ...prevChats };
      if (newChats[chatKey]) {
        newChats[chatKey] = newChats[chatKey].map(msg => {
          if (readerType === 'admin' && msg.sender !== 'admin' && !msg.readByAdmin) { // Mensajes del usuario para admin
            return { ...msg, readByAdmin: true };
          }
          if (readerType === 'user' && msg.sender !== 'user' && !msg.readByUser) { // Mensajes del admin para usuario
            return { ...msg, readByUser: true };
          }
          return msg;
        });
      }
      return newChats;
    });
  };

  const handleOpenChatForOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setActiveChatUserEmail(order.user.email); // El email del usuario del pedido
      setActiveChatOrderId(orderId);
      setCurrentView('chat');
    }
  };

  const handleCloseChat = () => {
    setActiveChatUserEmail(null);
    setActiveChatOrderId(null);
    setCurrentView('products');
  };

  const getUnreadMessagesCount = (chatKey) => {
    if (!chats[chatKey]) return 0;
    if (isAdmin) {
      return chats[chatKey].filter(msg => msg.sender !== 'admin' && !msg.readByAdmin).length;
    } else if (user && chatKey === user.email) { // Chat general del usuario
      return chats[chatKey].filter(msg => msg.sender !== 'user' && !msg.readByUser).length;
    } else if (user && chatKey.startsWith('order_')) { // Chat de pedido del usuario
      return chats[chatKey].filter(msg => msg.sender !== 'user' && !msg.readByUser).length;
    }
    return 0;
  };

  // Calcular mensajes no leídos para el botón de chat del usuario
  const userTotalUnreadMessages = user ? Object.keys(chats).reduce((total, chatKey) => {
    // Solo contar mensajes no leídos para los chats del usuario actual
    if (chatKey === user.email || (chatKey.startsWith('order_') && orders.some(o => o.id === parseInt(chatKey.split('_')[1]) && o.user.email === user.email))) {
      return total + getUnreadMessagesCount(chatKey);
    }
    return total;
  }, 0) : 0;


  // Renderizado de vistas
  if (isAdmin && currentView === 'admin') {
    return (
      <AdminPanel 
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onRemoveProduct={handleRemoveProduct} // Pasar la función de eliminar
        onLogout={handleLogout}
        orders={orders}
        onUpdateOrder={handleUpdateOrder}
        chats={chats}
        onSendMessage={handleSendMessage}
        onMarkMessagesRead={handleMarkMessagesRead}
        onOpenChatForOrder={handleOpenChatForOrder} 
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegistrationForm 
        onRegister={handleRegister} 
        onBack={() => setCurrentView('products')} 
      />
    );
  }

  if (currentView === 'cart') {
    return (
      <CartView 
        cart={cart}
        onUpdateCart={setCart}
        onPlaceOrder={placeOrder} 
        onBack={() => setCurrentView('products')}
      />
    );
  }

  if (currentView === 'userOrders') {
    return (
      <UserOrders
        user={user}
        orders={orders}
        onCancelOrder={handleCancelOrder}
        onConfirmOrder={handleConfirmOrderNow}
        onBack={() => setCurrentView('products')}
        onOpenChatForOrder={handleOpenChatForOrder}
      />
    );
  }

  if (currentView === 'chat') {
    const chatMessages = activeChatOrderId ? chats[`order_${activeChatOrderId}`] : chats[activeChatUserEmail];
    const orderDetails = activeChatOrderId ? orders.find(o => o.id === activeChatOrderId) : null;
    const chatKey = activeChatOrderId ? `order_${activeChatOrderId}` : activeChatUserEmail;

    return (
      <ChatWindow
        userEmail={activeChatUserEmail}
        messages={chatMessages || []}
        onSendMessage={handleSendMessage}
        onCloseChat={handleCloseChat}
        onMarkMessagesRead={handleMarkMessagesRead}
        orderId={activeChatOrderId}
        orderDetails={orderDetails}
        chatKey={chatKey}
      />
    );
  }

  if (currentView === 'checkout') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">¡Pedido Confirmado!</h2>
          <p className="text-gray-700 mb-6">Tu pedido ha sido recibido y está pendiente de aprobación. Recibirás una notificación cuando sea aceptado.</p>
          <p className="text-gray-700 mb-6">Recuerda que tienes 1 hora para cancelar tu pedido.</p>
          <button
            onClick={() => { setCart([]); setCurrentView('products'); }}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  // Vista por defecto: productos
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Mi Tienda</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentView('cart')}
            className="relative bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-gray-700 font-medium"
          >
            <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Carrito ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
          <UserAuth 
            onLogin={handleUserLogin} 
            onRegisterClick={() => setCurrentView('register')} 
            user={user}
            onLogout={handleLogout}
            onViewOrders={() => setCurrentView('userOrders')} 
            unreadMessagesCount={userTotalUnreadMessages}
          />
        </div>
      </header>
      <ProductGrid products={products} onAddToCart={addToCart} />
      {activeChatUserEmail && currentView !== 'chat' && ( // Mostrar ventana de chat si hay un chat activo y no es la vista principal de chat
        <ChatWindow
          userEmail={activeChatUserEmail}
          messages={activeChatOrderId ? chats[`order_${activeChatOrderId}`] : chats[activeChatUserEmail] || []}
          onSendMessage={handleSendMessage}
          onCloseChat={handleCloseChat}
          onMarkMessagesRead={handleMarkMessagesRead}
          orderId={activeChatOrderId}
          orderDetails={activeChatOrderId ? orders.find(o => o.id === activeChatOrderId) : null}
          chatKey={activeChatOrderId ? `order_${activeChatOrderId}` : activeChatUserEmail}
        />
      )}
    </div>
  );
}