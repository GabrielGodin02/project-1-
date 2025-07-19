import React from 'react';
import ProductItem from './ProductItem';

const ProductsList = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {products.map(product => (
        <ProductItem 
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductsList;