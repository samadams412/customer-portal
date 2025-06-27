'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/cart-context';
import { Product } from '@/types/interface';
import { toast } from 'sonner';

interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast(`${product.name} (${quantity}) added to cart`)
    setQuantity(1); // reset quantity
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button variant="outline" onClick={() => setQuantity(quantity + 1)}>+</Button>
      </div>

      {/* Add to Cart Button */}
      <Button onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </div>
  );
}
