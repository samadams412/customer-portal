// src/components/ProductCard.tsx
import React from 'react';
// FIX: Import Link component from next/link for navigation
import Link from 'next/link';
import { Product } from '@/types/product';

// Define the ProductCard component using the destructuring and inline type annotation
export function ProductCard({ product }: { product: Product }) {
  return (
    // FIX: Wrap the entire card in a Link component to make it clickable
    // The href dynamically points to the product's detail page using its ID
    <Link href={`/products/${product.id}`} passHref>
      {/* Use a div as the child of Link, applying styles to make it appear as a card */}
      <div className="bg-card text-foreground rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 flex flex-col p-4 cursor-pointer">
        {/* Product Image */}
        <img
          src={product.imageUrl || `https://placehold.co/400x300/F0F0F0/ADADAD?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
          onError={(e) => {
            // Fallback to a placeholder image if the image fails to load
            e.currentTarget.src = `https://placehold.co/400x300/F0F0F0/ADADAD?text=${encodeURIComponent(product.name)}`;
            e.currentTarget.onerror = null; // Prevent infinite loop if fallback also fails
          }}
        />

        {/* Product Details - these will now be part of the clickable area */}
        <div className="flex-grow flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
          {/* Apply new semantic colors for inStock status */}
          <p className={`text-sm font-medium ${product.inStock ? 'text-secondary' : 'text-destructive'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </div>
    </Link>
  );
}
