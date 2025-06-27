// src/app/product/page.tsx
import React from 'react';
import ProductInteractiveList from '@/components/app-ui/products/ProductInteractiveList'

// Define the main page component for the products route
const ProductPage: React.FC = () => {
  return (
    
    <main>
      <ProductInteractiveList />
    </main>
  );
};

export default ProductPage;
