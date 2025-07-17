'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/cart-context';
import { Product } from '@/types/interface';
import { useToast } from "@/components/ui/use-toast";

interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast, dismiss } = useToast(); // ✅ Add `dismiss`
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = () => {
    try {
      addToCart(product, quantity);

      // ✅ Prevent toasts from stacking or freezing
      dismiss(); // Clears any existing stuck toast before showing a new one

      toast({
        className: "bg-[#22d444] scale-90 sm:scale-75",
        title: "Success",
        description: `${product.name} (${quantity}) added to cart!`,
        duration: 3000, // Ensure toast disappears on mobile
      });

      setQuantity(1); // Reset quantity
    } catch (error) {
      toast({
        className: "scale-90 sm:scale-75",
        variant: "destructive",
        title: "Error",
        description: "Could not add item(s) to cart. Please try again.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="bg-accent"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={!product.inStock}
        >
          −
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          onClick={() => setQuantity(quantity + 1)}
          disabled={!product.inStock}
        >
          +
        </Button>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        className="bg-accent"
        variant="actionGreen"
        disabled={!product.inStock}
      >
        Add to Cart
      </Button>
    </div>
  );
}
