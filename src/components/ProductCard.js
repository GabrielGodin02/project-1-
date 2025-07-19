import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full h-full flex flex-col">
      <div className="h-40 bg-gray-100 flex items-center justify-center p-2">
        {product.image ? (
          <img 
            src={`/images/${product.image}`} 
            alt={product.name}
            className="h-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-3 flex-grow flex flex-col">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-2">{product.description}</p>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-sm">${product.price}</span>
            <span className="text-xs text-gray-500">{product.stock} disponibles</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-l-md text-xs"
            >
              -
            </button>
            <span className="px-2 py-1 bg-gray-100 text-xs">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-r-md text-xs"
            >
              +
            </button>
            <button 
              onClick={() => onAddToCart(product, quantity)}
              className="ml-auto bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md text-xs"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

// DONE