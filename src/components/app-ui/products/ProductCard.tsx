// src/components/ProductCard.tsx
'use client'; // This component needs client-side features like event handlers

import React from 'react';
// FIX: Correct import path for Product interface as per your product.ts file
import { Product } from '@/types/interface'; 
// FIX: Import the AddToCartForm component
import { AddToCartForm } from '@/components/app-ui/cart/AddToCartForm';
import { formatPrice } from '@/lib/utils'; // Assuming formatPrice is in utils
import Image from 'next/image'
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    // Removed Link wrapper: The card itself is no longer a navigation link.
    // Interaction is now focused on the AddToCartForm and other potential actions.
    <div className="bg-card text-foreground rounded-lg shadow-md overflow-hidden 
                    transform transition-transform duration-300 hover:scale-105 
                    flex flex-col p-4 border border-border space-y-4"> {/* Added border and spacing */}
      {/* Product Image */}
     <div className="relative w-full h-48 overflow-hidden rounded-md">
        <Image
          src={product.imageUrl || `https://placehold.co/400x300/F0F0F0/ADADAD?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, 400px"
          onError={() => {
            // Note: Next.js <Image> doesn't support onError directly with external URLs,
            // so you'll need to ensure fallback handling is done in logic (e.g. on the product.imageUrl)
          }}
        />
    </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{product.name}</h3> {/* Added line-clamp */}
        <p className="text-lg font-bold mb-2 text-primary">{formatPrice(product.price)}</p> {/* Used formatPrice and text-primary */}
        {/* Apply new semantic colors for inStock status */}
        <p className={`text-sm font-medium ${product.inStock ? 'text-secondary' : 'text-destructive'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </p>
      </div>

      {/* Add To Cart Form - now integrated directly */}
      <div className="mt-auto pt-4"> {/* Use mt-auto to push to bottom, pt-4 for spacing */}
        <AddToCartForm product={product}/>
      </div>
    </div>
  );
}
