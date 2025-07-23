// src/context/cart-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession for NextAuth integration

// FIX: Using interface.ts as per user's confirmation
import { Product, CartItem } from '@/types/interface';

// Toast
import { useToast } from "@/components/ui/use-toast";

// Define the key for localStorage
const LOCAL_STORAGE_CART_KEY = 'frontend_cart_items';
const LOCAL_STORAGE_DISCOUNT_KEY = 'frontend_discount_code'; // New key for discount persistence

// Define the structure of the cart state and actions provided by the context
interface CartContextType {
  cartItems: CartItem[]; // Array of cart items (aligned with types/product.ts)
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void; // Remove by the unique cart item ID
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void; // New function to clear the entire cart
  isLoading: boolean; // Indicate if cart data is being loaded (from localStorage)
  cartTotal: number; // Total price of items in the cart
  cartCount: number; // Total number of unique items/quantity in the cart
    // New discount-related states and functions
  discountCode: string | null;
  discountAmount: number;
  applyDiscountCode: (code: string) => void;
  removeDiscount: () => void;
  finalTotal: number; // New: cartTotal - discountAmount
}

// Create the CartContext with a default (initial) value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props for the CartProvider component
interface CartProviderProps {
  children: ReactNode; // Allows wrapping other components
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // True initially while loading from localStorage
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const { data: session, status } = useSession(); // Get session data and status from NextAuth
  const { toast } = useToast(); 


  

  // --- Load Cart & Discount from Local Storage on Mount ---
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      const storedDiscountCode = localStorage.getItem(LOCAL_STORAGE_DISCOUNT_KEY);
      if (storedDiscountCode) {
        // Re-apply discount logic on load (e.g., if code is still valid)
        // For simplicity, we'll just set the code, and applyDiscountCode will re-calculate
        // In a real app, you might re-validate with backend here.
        setDiscountCode(storedDiscountCode);
        // Recalculate discount amount based on current cart items
        // This will be done in the useMemo for contextValue
      }
    } catch (error) {
      console.error("Failed to load cart/discount from localStorage:", error);
      setCartItems([]);
      setDiscountCode(null);
      setDiscountAmount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Save Cart & Discount to Local Storage Whenever they Change ---
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
        if (discountCode) {
          localStorage.setItem(LOCAL_STORAGE_DISCOUNT_KEY, discountCode);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_DISCOUNT_KEY);
        }
      } catch (error) {
        console.error("Failed to save cart/discount to localStorage:", error);
      }
    }
  }, [cartItems, discountCode, isLoading]);

  // --- Reset Cart & Discount on Logout / Session Expiry ---
  useEffect(() => {
    if (status === 'unauthenticated' && !isLoading) {
      //console.log("User logged out or session expired. Clearing cart and discount.");
      setCartItems([]);
      setDiscountCode(null);
      setDiscountAmount(0);
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      localStorage.removeItem(LOCAL_STORAGE_DISCOUNT_KEY);
    }
  }, [status, isLoading]);

  // TODO: Add functionality to clear cart items after checkout redirect.
  // --- Cart Operations (Local State Management) ---
const addToCart = useCallback((product: Product, quantity: number) => {
  if (quantity <= 0) {
    console.warn(`Attempted to add product ${product.id} with invalid quantity: ${quantity}`);
    return;
  }

  setCartItems(currentItems => {
    const existingItem = currentItems.find(item => item.productId === product.id);

    if (existingItem) {
      return currentItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    }

    const newCartItem: CartItem = {
      id: crypto.randomUUID(), // Create a new cart item with unique ID
      productId: product.id,
      quantity,
      product,
    };

    return [...currentItems, newCartItem];
  });
}, []);


  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(currentItems => {
      const filteredItems = currentItems.filter(item => item.id !== cartItemId);
      //console.log(`Removed item ${cartItemId} from cart.`);
      return filteredItems;
    });
  }, []); // No dependencies

  const updateCartItemQuantity = useCallback((cartItemId: string, quantity: number) => {
    setCartItems(currentItems => {
      const updatedItems = currentItems.map(item => {
        if (item.id === cartItemId) {
          if (quantity <= 0) {
            // If quantity is 0 or less, effectively remove the item by filtering it out later
            //console.log(`Setting quantity to 0 for item ${cartItemId}, will be removed.`);
            return { ...item, quantity: 0 };
          }
          //console.log(`Updated quantity for item ${cartItemId} to ${quantity}`);
          return { ...item, quantity: quantity };
        }
        return item;
      }).filter(item => item.quantity > 0); // Filter out items with 0 or less quantity
      return updatedItems;
    });
  }, []); // No dependencies

const clearCart = useCallback(() => {
  try {
    setCartItems([]);
    setDiscountCode(null);
    setDiscountAmount(0);

    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    localStorage.removeItem(LOCAL_STORAGE_DISCOUNT_KEY);

    toast({
      className: "bg-[#22d444] scale-70",
      title: "SUCCESS!",
      description: "Cart and discount have been cleared!",
      duration: 4000,
    });
  } catch (error) {
    toast({
      className: "scale-70",
      variant: "destructive",
      title: "ERROR!",
      description: "Could not clear cart and discount. Please try again.",
      duration: 4000,
    });
  }
}, [toast]);


  // Calculate cart total (subtotal before discount/tax)
  const cartTotal = React.useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cartItems]);

const applyDiscountCode = useCallback(async (code: string) => {
  if (!code) return;

  try {
    const res = await fetch("/api/discount/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (res.ok && data.valid && typeof data.amount === "number") {
      const discountValue = parseFloat(
        (cartTotal * (data.amount / 100)).toFixed(2)
      );

      setDiscountCode(data.code);
      setDiscountAmount(discountValue);

      toast({
        className: "bg-secondary text-secondary-foreground scale-70",
        title: "Discount Applied!",
        description: `${data.code} — ${data.amount}% off your order.`,
        duration: 3000,
      });
    } else {
      throw new Error("Invalid discount code");
    }
  } catch (err) {
    setDiscountCode(null);
    setDiscountAmount(0);
    toast({
      className: "bg-destructive text-destructive-foreground scale-70",
      title: "Invalid Discount Code",
      description: "The discount code you entered is not valid.",
      duration: 3000,
    });
  }
}, [cartTotal, toast]);



  const removeDiscount = useCallback(() => {
    setDiscountCode(null);
    setDiscountAmount(0);
    toast({
      className: "bg-muted text-muted-foreground scale-70",
      title: "Discount Removed",
      description: "Any applied discount has been removed.",
      duration: 2000
    });
  }, [toast]);



  // Calculate total number of items (sum of quantities)
  const cartCount = React.useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Calculate final total after discount (before tax on backend)
  const finalTotal = React.useMemo(() => {
    const totalAfterDiscount = Math.max(0, cartTotal - discountAmount);
    return totalAfterDiscount;
  }, [cartTotal, discountAmount]);


  const contextValue = React.useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    isLoading,
    cartTotal, // This is now the subtotal before discount
    cartCount,
    discountCode,
    discountAmount,
    applyDiscountCode,
    removeDiscount,
    finalTotal, // The total after discount
  }), [
    cartItems, addToCart, removeFromCart, updateCartItemQuantity, clearCart,
    isLoading, cartTotal, cartCount, discountCode, discountAmount,
    applyDiscountCode, removeDiscount, finalTotal
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
