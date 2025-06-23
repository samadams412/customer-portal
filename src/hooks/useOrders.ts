// Custom hook to manage order data, loading states, and errors.

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession for authentication status
import { Order } from '@/types/product'; // Import Order interface

interface UseOrdersReturn {
  orders: Order[];
  loadingOrders: boolean;
  orderError: string | null;
  fetchOrders: () => Promise<void>; // Export fetchOrders for external trigger
}

/**
 * Custom hook for managing user orders, including fetching and handling states.
 *
 * @returns An object containing order data, loading/error states, and the fetchOrders handler.
 */
export function useOrders(): UseOrdersReturn {
  const { data: session, status } = useSession(); // Get session data and status

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);

  // --- Data Fetching ---
  const fetchOrders = useCallback(async () => {
    // Only fetch if authenticated and user ID is available
    if (status !== 'authenticated' || !session?.user?.id) {
      setLoadingOrders(false);
      setOrderError("Not authenticated to fetch orders.");
      return;
    }

    setLoadingOrders(true);
    setOrderError(null);
    try {
      // No manual token handling needed; NextAuth.js session cookies are automatically sent
      const res = await fetch('/api/orders');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to fetch orders: ${res.status}`);
      }

      const data: Order[] = await res.json();
      setOrders(data);
    } catch (error: unknown) {
      console.error("Error fetching orders:", error);
      setOrderError(error instanceof Error ? error.message : "Failed to load orders.");
    } finally {
      setLoadingOrders(false);
    }
  }, [status, session?.user?.id]); // Dependencies for useCallback

  return {
    orders,
    loadingOrders,
    orderError,
    fetchOrders, // Expose fetchOrders for the main DashboardPage to trigger initially
  };
}
