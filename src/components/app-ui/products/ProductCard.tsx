'use client';

import React from 'react';
import { Product } from '@/types/interface';
import { AddToCartForm } from '@/components/app-ui/cart/AddToCartForm';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  console.log(`[Render] ProductCard: ${product.id} - ${product.name}`);

  return (
    <div className="bg-card text-foreground rounded-lg shadow-md overflow-hidden 
                    transform transition-transform duration-300 hover:scale-105 
                    flex flex-col p-4 border border-border space-y-4">
      <div className="relative w-full h-48 overflow-hidden rounded-md">
        <Image
          src={
            product.imageUrl ||
            `https://placehold.co/400x300/F0F0F0/ADADAD?text=${encodeURIComponent(
              product.name
            )}`
          }
          alt={product.name}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-lg font-bold mb-2 text-primary">
          {formatPrice(product.price)}
        </p>
        <p
          className={`text-sm font-medium ${
            product.inStock ? 'text-secondary' : 'text-destructive'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </p>
      </div>

      <div className="mt-auto pt-4">
        <AddToCartForm product={product} />
      </div>
    </div>
  );
}

// ✅ Memoized to avoid unnecessary re-renders
export const ProductCard = React.memo(ProductCardComponent);
