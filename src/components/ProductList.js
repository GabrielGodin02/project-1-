import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, cart, onAddToCart, onViewCart, onAdminLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tienda Online</h1>
          <div className="flex gap-4">
            <button 
              onClick={onViewCart}
              className="relative bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Carrito ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </button>
            <button
              onClick={onAdminLogin}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;