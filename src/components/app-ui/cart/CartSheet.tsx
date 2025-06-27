'use client';

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/cart-context";
import { CartItem } from "./CartItem";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export function CartSheet() {
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();

const handleCheckout = async () => {
  console.log(cartItems);
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems }),
    });

    if (!res.ok) {
      const error = await res.json();
      toast.error(`Checkout failed: ${error.error}`);
      return;
    }

    const { url } = await res.json();
    if (url) {
      window.location.href = url; // Redirect to Stripe Checkout
    }
  } catch (err) {
    console.error("Checkout error:", err);
    toast.error('Something went wrong during checkout.');
  }
};



  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Cart"
          variant="outline"
          size="icon"
          className="relative h-9 w-9"
        >
          {cartCount > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">
              {cartCount}
            </Badge>
          )}
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6 pb-4">
          <SheetTitle className="text-2xl font-semibold">
            Cart {cartCount > 0 && `(${cartCount})`}
          </SheetTitle>
        </SheetHeader>
        <Separator />

        {cartCount > 0 ? (
          <>
            <div className="flex flex-1 flex-col overflow-hidden">
              <ScrollArea className="h-full px-6">
                <div className="flex flex-col gap-5 py-6">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
            </div>

            <SheetFooter className="border-t p-6 flex-col gap-4">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Subtotal:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive hover:bg-destructive/10"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground px-4">
            <ShoppingCart className="h-16 w-16 text-muted" />
            <p className="text-xl font-semibold">Your cart is empty.</p>
            <p className="text-sm">Add items to get started!</p>
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Start Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
