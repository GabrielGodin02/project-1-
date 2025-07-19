import React, { useState } from 'react';

const ProductItem = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex flex-col transition-all duration-300 hover:shadow-md">
      <div className="h-48 bg-gray-50 flex items-center justify-center p-2">
        {product.image ? (
          <img 
            src={product.image} // Usar la URL completa de la imagen
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-sm">Sin imagen</div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg mb-1 text-gray-900">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-xl">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        <div className="flex items-center mt-auto">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md transition-colors text-base"
          >
            -
          </button>
          <span className="px-4 py-1 bg-gray-50 text-gray-800 text-base">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md transition-colors text-base"
          >
            +
          </button>
          <button 
            onClick={() => onAddToCart(product, quantity)}
            className="ml-auto bg-black hover:bg-gray-800 text-white px-4 py-1 rounded-md transition-colors text-base font-medium"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;