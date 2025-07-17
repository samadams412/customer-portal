'use client';

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAddresses } from "@/hooks/useAddresses";
import { Input } from "@/components/ui/input";
import Link from "next/link";


export function CartSheet() {
    // Destructure new discount-related states and functions
  const {
    cartItems,
    cartCount,
    cartTotal, // This is now the subtotal before discount
    clearCart,
    discountCode,
    discountAmount,
    applyDiscountCode,
    removeDiscount,
    finalTotal, // The total after discount
  } = useCart();
  const [deliveryType, setDeliveryType] = React.useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [shippingAddressId, setShippingAddressId] = React.useState<string | null>(null);
  const [discountInput, setDiscountInput] = React.useState<string>(''); // State for discount input field

  const {
    addresses,
    fetchAddresses,
    loadingAddresses,
    addressError,
  } = useAddresses();

  React.useEffect(() => {
    if (deliveryType === 'DELIVERY') {
      fetchAddresses();
    }
  }, [deliveryType, fetchAddresses]);

    const handleApplyDiscount = () => {
      if (discountInput.trim()) {
        applyDiscountCode(discountInput.trim());
      } else {
        removeDiscount(); // If input is empty, remove any existing discount
      }
  };

  const handleCheckout = async () => {

        // Basic validation
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }
    if (deliveryType === 'DELIVERY' && !shippingAddressId) {
      toast.error("Please select a shipping address for delivery.");
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          deliveryType,
          shippingAddressId,
          discountCode, // Pass the applied discount code
          discountAmount, // Pass the calculated discount amount
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(`Checkout failed: ${error.error}`);
        return;
      }
      clearCart(); // Reset the cart here when we direct to checkout
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error('Something went wrong during checkout.');
    }
  };

  return (
    <Sheet onOpenChange={(open) => {
        if (open && deliveryType === 'DELIVERY') {
          fetchAddresses();
        }
      }}>

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
          <SheetDescription className="sr-only">
            Review items in your cart and choose a delivery option before checkout.
          </SheetDescription>
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
                  {/* Discount Code Input */}
              <div className="w-full">
                <Label htmlFor="discount-code" className="block mb-2 font-medium">Discount Code:</Label>
                <div className="flex space-x-2">
                  <Input
                    id="discount-code"
                    placeholder="Enter code"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    className="flex-1 border-border bg-input"
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    variant="outline"
                    className="shrink-0 text-primary border-primary hover:bg-primary/10"
                    disabled={!discountInput.trim()} // Disable if input is empty
                  >
                    Apply
                  </Button>
                </div>
                {discountCode && (
                  <p className="text-sm text-secondary mt-2">
                    Applied: {discountCode} (-{formatPrice(discountAmount)})
                    <Button
                      variant="link"
                      size="sm"
                      onClick={removeDiscount}
                      className="text-destructive hover:text-destructive/80 ml-2 h-auto p-0"
                    >
                      Remove
                    </Button>
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end text-base font-semibold w-full">
                {discountAmount > 0 ? (
                  <>
                    <div className="flex justify-between w-full">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-muted-foreground line-through">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between w-full">
                      <span>Discounted Total:</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between w-full">
                    <span>Subtotal:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <Label className="block mb-2 font-medium">Delivery Option:</Label>
                <RadioGroup
                  defaultValue="PICKUP"
                  onValueChange={(value) => setDeliveryType(value as 'PICKUP' | 'DELIVERY')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PICKUP" id="pickup" />
                    <Label htmlFor="pickup">Pickup</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DELIVERY" id="delivery" />
                    <Label htmlFor="delivery">Delivery</Label>
                  </div>
                </RadioGroup>
              </div>

              {deliveryType === 'DELIVERY' && (
                <div className="w-full mt-4">
                  <Label className="block mb-2 font-medium">Select Address:</Label>
                  {loadingAddresses ? (
                    <p className="text-sm text-muted-foreground">Loading addresses...</p>
                  ) : addressError ? (
                    <p className="text-sm text-red-500">{addressError}</p>
                  ) : addresses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No addresses found. Please add one in your profile.</p>
                  ) : (
                    <RadioGroup
                      value={shippingAddressId || ''}
                      onValueChange={setShippingAddressId}
                      className="space-y-2"
                    >
                      {addresses.map((address) => (
                        <div key={address.id} className="flex items-start space-x-2">
                          <RadioGroupItem value={address.id} id={`address-${address.id}`} />
                          <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                            <div>{address.street}</div>
                            <div className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.zipCode}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              )}

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
            <Link href="/products">
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Start Shopping
            </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
