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
  const { data: session, status } = useSession(); // Get session data and status from NextAuth
  const { toast } = useToast(); 


  
  // --- Load Cart from Local Storage on Mount ---
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      // Fallback to empty cart if localStorage is corrupted or inaccessible
      setCartItems([]);
    } finally {
      setIsLoading(false); // Loading is complete regardless of success/failure
    }
  }, []); // Run only once on mount

  // --- Save Cart to Local Storage Whenever cartItems Changes ---
  useEffect(() => {
    if (!isLoading) { // Only save once initial load is done
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
        //console.log("Cart saved to localStorage:", cartItems);
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [cartItems, isLoading]); // Re-run whenever cartItems changes

  // --- Reset Cart on Logout / Session Expiry ---
  useEffect(() => {
    // If session status changes to 'unauthenticated' (logged out), clear the cart
    // Ensure this only runs after the initial session check is complete ('loading' -> 'unauthenticated')
    if (status === 'unauthenticated' && !isLoading) {
      //console.log("User logged out or session expired. Clearing cart.");
      setCartItems([]); // Clear cart
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY); // Clear localStorage
    }
  }, [status, isLoading]); // Re-run when session status or loading state changes

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
      //console.log("Cart cleared.");
      toast({
        className: "bg-[#22d444] scale-70", 
        title: "SUCCESS!", 
        description: "All items removed from cart!",
        duration: 4000
      });
    } catch(error) {
      toast({
        className: "scale-70",
        variant: "destructive", 
        title: "ERROR!", 
        description: "Could not add item(s) to cart. Please try again.",
        duration: 4000
      }); 
    }
  }, []);

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Calculate total number of items (sum of quantities)
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);


  const contextValue = React.useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart, 
    isLoading,
    cartTotal,
    cartCount,
  }), [cartItems, addToCart, removeFromCart, updateCartItemQuantity, clearCart, isLoading, cartTotal, cartCount]);

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
