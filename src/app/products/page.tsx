// src/app/product/page.tsx
import React from 'react';
import ProductInteractiveList from '@/components/app-ui/products/ProductInteractiveList'

// Toast
import { Toaster } from "@/components/ui/toaster"

// Define the main page component for the products route
const ProductPage: React.FC = () => {
  return (
    
    <main>
      <ProductInteractiveList />
      <Toaster />
    </main>
  );
};

export default ProductPage;
