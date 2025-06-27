// src/components/app-ui/cart/CartSheet.tsx
'use client';

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter, // Added SheetFooter for checkout button
} from "@/components/ui/sheet"; // Shadcn Sheet components
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Badge } from "@/components/ui/badge"; // Shadcn Badge
import { Separator } from "@/components/ui/separator"; // Shadcn Separator
import { ScrollArea } from "@/components/ui/scroll-area"; // Shadcn ScrollArea
import { useCart } from "@/context/cart-context"; // Correct path to useCart
import { CartItem } from "./CartItem"; // Import CartItem component
import { ShoppingCart } from "lucide-react"; // Lucide shopping cart icon
import { formatPrice } from "@/lib/utils"; // Your price formatting utility
import Link from "next/link";

export function CartSheet() {
  const { cartItems, cartCount, cartTotal, clearCart } = useCart(); // Destructure clearCart

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Cart"
          variant="outline"
          size="icon"
          className="relative h-9 w-9 bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {cartCount > 0 && (
            <Badge
              variant="default" // Use default or primary variant for the count badge
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground" // Apply primary colors
            >
              {cartCount}
            </Badge>
          )}
          <ShoppingCart className="h-5 w-5" aria-hidden="true" /> {/* Lucide shopping cart icon */}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg bg-card text-foreground"> {/* Apply card background */}
        <SheetHeader className="px-6 pb-4"> {/* Increased padding for header */}
          <SheetTitle className="text-2xl font-semibold">
            Cart {cartCount > 0 && `(${cartCount})`}
          </SheetTitle>
        </SheetHeader>
        <Separator className="bg-border" /> {/* Apply border color to separator */}

        {cartCount > 0 ? (
          <>
            <div className="flex flex-1 flex-col overflow-hidden">
              <ScrollArea className="h-full px-6"> {/* Apply horizontal padding to scroll area */}
                <div className="flex flex-col gap-5 py-6"> {/* Vertical padding for items */}
                  {cartItems.map((item) => (
                    // CartItem already handles its own spacing and border-b.
                    // Removed extra div and space-y-3 here as CartItem already has it.
                    <CartItem key={item.id} item={item} /> 
                  ))}
                </div>
              </ScrollArea>
            </div>
            {/* Sheet Footer for total and checkout/clear buttons */}
            <SheetFooter className="bg-background border-t border-border p-6 flex-col gap-4"> {/* Apply background/border, flex-col */}
              <div className="flex items-center justify-between text-base font-semibold text-foreground">
                <span>Subtotal:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive hover:bg-destructive/10"
                onClick={clearCart} // Button to clear the cart
              >
                Clear Cart
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-center text-muted-foreground px-4">
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
