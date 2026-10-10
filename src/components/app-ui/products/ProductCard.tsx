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
  

  return (
    <div className="group bg-card text-card-foreground rounded-xl overflow-hidden border border-border
                    flex flex-col transition-shadow duration-200 hover:shadow-lg">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={
            product.imageUrl ||
            `https://placehold.co/400x300/F0F0F0/ADADAD?text=${encodeURIComponent(
              product.name
            )}`
          }
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      <div className="flex-grow flex flex-col gap-1 px-5 pt-5">
        <h3 className="text-lg font-medium leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-base font-semibold tabular-nums">
          {formatPrice(product.price)}
        </p>
        <p
          className={`text-sm font-medium ${
            product.inStock ? 'text-success' : 'text-destructive'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </p>
      </div>

      <div className="mt-auto p-5 pt-4">
        <AddToCartForm product={product} />
      </div>
    </div>
  );
}

// ✅ Memoized to avoid unnecessary re-renders
export const ProductCard = React.memo(ProductCardComponent);
