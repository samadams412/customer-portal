// src/components/app-ui/cart/CartItemActions.tsx
'use client';

import React from 'react';
import { useCart } from '@/context/cart-context'; // Correct path to useCart
import { CartItem } from '@/types/interface'; // Correct path to CartItem type
import { Button } from '@/components/ui/button'; // Shadcn Button
import { Input } from '@/components/ui/input'; // Shadcn Input
import { Trash2 } from 'lucide-react'; // Lucide icon for trash

interface CartItemActionsProps {
  item: CartItem; // Expects a CartItem object
}

export function CartItemActions({ item }: CartItemActionsProps) {
  const { updateCartItemQuantity, removeFromCart } = useCart();

  // Handle quantity change from input or +/- buttons
  const handleQuantityChange = (newQuantity: number) => {
    // Ensure quantity is at least 1 before updating
    const quantity = Math.max(1, Number(newQuantity));
    updateCartItemQuantity(item.id, quantity); // Update by CartItem's unique ID
  };

  // Handle click to remove item from cart
  const handleRemoveClick = () => {
    removeFromCart(item.id); // Remove by CartItem's unique ID
  };

  return (
    <div className='flex items-center space-x-1'>
      <Button
        variant="outline"
        size="icon"
        className='h-8 w-8 border-border text-foreground hover:bg-accent'
        onClick={() => handleQuantityChange(item.quantity - 1)}
        disabled={item.quantity <= 1} // Disable decrement if quantity is 1
        aria-label={`Decrease quantity of ${item.product.name}`}
      >
        -
      </Button>
      <Input
        className='h-8 w-14 text-center text-sm font-medium border-border bg-input'
        type="number"
        min="1" // Minimum quantity is 1
        value={item.quantity}
        onChange={(e) => handleQuantityChange(Number(e.target.value))}
        aria-label={`Quantity of ${item.product.name}`}
      />
      <Button
        variant="outline"
        size="icon"
        className='h-8 w-8 border-border text-foreground hover:bg-accent'
        onClick={() => handleQuantityChange(item.quantity + 1)}
        aria-label={`Increase quantity of ${item.product.name}`}
      >
        +
      </Button>
      <Button
        variant="outline"
        size="icon"
        className='h-8 w-8 border-border text-destructive hover:bg-destructive/10' // Use destructive variant for remove
        onClick={handleRemoveClick}
        aria-label={`Remove ${item.product.name} from cart`}
      >
        <Trash2 className='h-4 w-4' /> {/* Lucide trash icon */}
      </Button>
    </div>
  );
}
