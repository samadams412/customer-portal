'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/cart-context';
import { Product } from '@/types/interface';
//import { toast } from 'sonner';

// Toast
import { useToast } from "@/components/ui/use-toast";


interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast(); 

  const handleAddToCart = () => {
    try {
      addToCart(product, quantity);
      //toast(`${product.name} (${quantity}) added to cart`)
      toast({
        className: "bg-[#22d444]", 
        title: "Success!", 
        description: `${product.name} (${quantity}) added to cart`
      });

      setQuantity(1); // reset quantity
    } catch(error) {
      toast({
        variant: "destructive", 
        title: "ERROR!", 
        description: "Something went wrong. Please try again."
      });    
    }
  };

  return (
    <div className="flex flex-col space-y-3" >
      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <Button variant="outline" className='bg-accent' onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!product.inStock}>−</Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button variant="outline" onClick={() => setQuantity(quantity + 1)} disabled={!product.inStock}>+</Button>
      </div>

      {/* Add to Cart Button */}
      <Button onClick={handleAddToCart} className='bg-accent' variant="actionGreen" disabled = {!product.inStock}>
        Add to Cart
      </Button>
    </div>
  );
}
