import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-gray-500 text-sm">${item.price} c/u</p>
      </div>
      <div className="flex items-center">
        <button 
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-l-md transition-colors"
        >
          -
        </button>
        <span className="px-3 py-1 bg-gray-100">{item.quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-r-md transition-colors"
        >
          +
        </button>
        <button 
          onClick={() => onRemove(item.id)}
          className="ml-4 text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CartItem;