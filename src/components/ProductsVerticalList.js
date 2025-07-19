import React from 'react';

const ProductsVerticalList = ({ products }) => {
  return (
    <div className="products-vertical-container">
      {products.map(product => (
        <div key={product.id} className="product-item-vertical">
          <div className="product-image">
            <img src={`/images/${product.image}`} alt={product.name} />
          </div>
          <div className="product-details">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="price-stock">
              <span>${product.price}</span>
              <span>{product.stock} disponibles</span>
            </div>
            <div className="quantity-controls">
              <button>-</button>
              <span>1</span>
              <button>+</button>
              <button className="add-to-cart">Añadir</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


## Implementación final:

1. Estructura de componentes:
   
   /components
   ├── UserMenuFinal.js    // Menú unificado
   ├── ProductsVerticalList.js // Lista vertical
   ├── ProductItem.js      // Item individual
   └── AdminPanel.js       // Panel admin oculto
   

2. Flujo de acceso:
   - Clientes normales: cualquier email
   - Admin: `admin@tienda.com` / `admin123`

3. Vista de productos:
   - Diseño vertical compacto
   - Responsive para móviles
   - Controles de cantidad integrados

¿Qué más necesitas ajustar para que la implementación sea perfecta para tu tienda online?