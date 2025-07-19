import React from 'react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products, onAddToCart }) => {
  return (
    <div className="relative">
      <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide">
        {products.map(product => (
          <div key={product.id} className="flex-shrink-0 w-64">
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;