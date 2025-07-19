import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = ({ userEmail, messages, onSendMessage, onCloseChat, onMarkMessagesRead, orderId, orderDetails, chatKey }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (chatKey) {
      onMarkMessagesRead(chatKey, 'user'); // Marcar mensajes como leídos por el usuario al abrir el chat
    }
  }, [messages, chatKey, onMarkMessagesRead]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(userEmail, messageText, 'user', orderId);
      setMessageText('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Chat con Admin {orderId ? `(Pedido #${orderId})` : ''}</h3>
        <button onClick={onCloseChat} className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        {orderDetails && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-3">
            <p className="font-semibold">Detalles del Pedido:</p>
            <p>Cliente: {orderDetails.user.name}</p>
            <p>Total: ${orderDetails.total.toFixed(2)}</p>
            <p>Items: {orderDetails.items.map(item => `${item.name} x${item.quantity}`).join(', ')}</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-75 block text-right">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
          placeholder="Escribe un mensaje..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={handleSendMessage}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;