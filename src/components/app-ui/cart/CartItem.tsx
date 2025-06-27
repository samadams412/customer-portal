// src/components/app-ui/cart/CartItem.tsx
'use client';

import * as React from "react";
import Image from "next/image";
// FIX: Import CartItem and Product from your types
import { CartItem as CartItemType } from "@/types/interface"; // Alias to avoid name conflict
import { formatPrice } from "@/lib/utils"; // Your utility for price formatting
import { CartItemActions } from "./CartItemActions"; // Import CartItemActions

interface CartItemProps {
  item: CartItemType; // Use the aliased CartItemType
}

export function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex items-center space-x-4 py-2 border-b border-border last:border-b-0 last:pb-0">
      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
        <Image
          src={item.product.imageUrl || `https://placehold.co/64x64/F0F0F0/ADADAD?text=${encodeURIComponent(item.product.name)}`}
          alt={item.product.name}
          sizes="64px" // Fixed size for cart item thumbnail
          fill // Occupy parent div
          className="absolute object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/64x64/F0F0F0/ADADAD?text=${encodeURIComponent(item.product.name)}`;
            e.currentTarget.onerror = null;
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 self-start text-sm">
        <span className="line-clamp-1 font-medium text-foreground">{item.product.name}</span>
        <span className="line-clamp-1 text-muted-foreground">
          {formatPrice(item.product.price)} x {item.quantity} ={" "}
          <span className="font-semibold text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
        </span>
        {/* Assuming product category exists and you want to display it */}
        {/* <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
          {item.product.category}
        </span> */}
      </div>
      <CartItemActions item={item} />
    </div>
  );
}
