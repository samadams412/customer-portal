// src/app/dashboard/orders/[id]/page.tsx
// This component displays the detailed information for a single order.

'use client'; // This is a client component as it fetches data on the client-side based on URL params.

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // For authentication status
import { Order, OrderItem } from '@/types/interface'; // Import relevant types
import { useAuthRedirect } from '@/hooks/useAuthRedirect'; // Import the useAuthRedirect hook

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component (e.g., from Shadcn UI)
import { Button } from '@/components/ui/button';

// Define props for the page component.
// We set 'params: any' here to satisfy Next.js's build-time type checking,
// as it sometimes expects a Promise type for params in dynamic routes.
interface OrderDetailPageProps {
  params: any;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  // In a 'use client' component, we cannot use 'await' directly at the top level
  // or 'React.use()' for resolving props like 'params'.
  // Instead, we use React's 'useState' and 'useEffect' to handle the asynchronous
  // resolution of 'params' safely after the component mounts.
  const [resolvedOrderId, setResolvedOrderId] = useState<string | null>(null);

  // useEffect to asynchronously resolve the 'orderId' from 'params'.
  // This ensures 'params.id' is accessed only after the Promise (if it is one) has resolved.
  useEffect(() => {
    const resolveId = async () => {
      try {
        // Promise.resolve ensures we can await it, whether 'params' is already a plain object
        // or actually a Promise.
        const resolvedParams = await Promise.resolve(params);
        setResolvedOrderId(resolvedParams.id);
      } catch (error) {
        console.error("Failed to resolve order ID from params:", error);
        // Optionally, handle error state for orderId resolution here
      }
    };
    resolveId();
  }, [params]); // Dependency on 'params' ensures this runs if 'params' object reference changes

  const router = useRouter();
  const { data: session, status } = useSession(); // Get session status and data

  // Integrate useAuthRedirect hook
  const isLoadingAuth = useAuthRedirect(status, router);

  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Order Details ---
  const fetchOrderDetails = useCallback(async () => {
    // Only fetch if authenticated, user ID is available, and orderId is present
    if (status !== 'authenticated' || !session?.user?.id || !resolvedOrderId) {
      if (status === 'authenticated' && !resolvedOrderId) {
        setError("Order ID is missing.");
      }
      setLoadingOrderDetails(false); // Ensure loading is false if conditions not met
      return;
    }

    setLoadingOrderDetails(true);
    setError(null);
    try {
      // API route will handle authentication via NextAuth.js session cookies
      const res = await fetch(`/api/orders/${resolvedOrderId}`);

      if (!res.ok) {
        const errorData = await res.json();
        // If 404 from API, set a specific error message
        if (res.status === 404) {
          setError("Order not found. It might have been deleted or never existed.");
        } else {
          throw new Error(errorData.error || `Failed to fetch order: ${res.status}`);
        }
      } else {
        const data: Order = await res.json();
        setOrder(data);
      }
    } catch (err: unknown) {
      console.error("Error fetching order details:", err);
      setError(err instanceof Error ? err.message : "Failed to load order details.");
    } finally {
      setLoadingOrderDetails(false);
    }
  }, [resolvedOrderId, status, session?.user?.id]); // Depend on resolvedOrderId, session status, and user ID

  // Trigger fetch when authentication status is ready and user is authenticated
  useEffect(() => {
    // Only proceed if resolvedOrderId is available, auth is not loading, and user is authenticated.
    if (resolvedOrderId && !isLoadingAuth && status === 'authenticated' && session?.user?.id) {
      fetchOrderDetails();
    }
  }, [isLoadingAuth, status, session?.user?.id, resolvedOrderId, fetchOrderDetails]);


  // --- Render Loading / Error States ---
  // Show skeleton if auth is loading, status is loading, or if resolvedOrderId is not yet available.
  if (isLoadingAuth || status === 'loading' || !resolvedOrderId || loadingOrderDetails) {
    return (
      <div className="container mx-auto p-6 space-y-8 min-h-screen">
        <Skeleton className="h-10 w-64 mb-6 bg-gray-200 dark:bg-gray-700" />
        <Card className="shadow-md p-6 bg-white dark:bg-gray-800">
          <Skeleton className="h-8 w-full mb-4 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-6 w-3/4 mb-6 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-40 w-full mb-4 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-24 w-full bg-gray-200 dark:bg-gray-700" />
        </Card>
      </div>
    );
  }

  // If useAuthRedirect has determined unauthenticated, it will redirect, so this won't render.
  if (status === 'unauthenticated') {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500 min-h-screen flex flex-col items-center justify-center">
        <p>Error: {error}</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-500 min-h-screen flex flex-col items-center justify-center">
        <p>Order data could not be loaded or found.</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  // --- Render Order Details ---
  return (
    <main className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Order Details</h1>
        <Button onClick={() => router.push('/dashboard')} variant="outline" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200">
          Back to Dashboard
        </Button>
      </div>

      <Card className="shadow-xl bg-white dark:bg-gray-800 p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Order #{order.id.substring(0, 8)}...
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Placed on: {new Date(order.orderDate).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Subtotal: ${order.subtotalAmount.toFixed(2)}</p>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Tax: ${order.taxAmount.toFixed(2)}</p>
              {order.discountAmount && order.discountAmount > 0 && (
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Discount: -${order.discountAmount.toFixed(2)}</p>
              )}
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Delivery Type: <Badge variant="secondary" className="ml-2">{order.deliveryType}</Badge>
              </p>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-2">
                Status: <Badge className={`ml-2 ${
                    order.status === 'DELIVERED' ? 'bg-green-500' :
                    order.status === 'SHIPPED' ? 'bg-yellow-500' :
                    order.status === 'PROCESSING' ? 'bg-blue-500' :
                    'bg-gray-500' // PENDING or CANCELLED
                  }`}>{order.status}</Badge>
              </p>
              {order.discountCode && (
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-2">
                  Discount Code: <Badge variant="outline" className="ml-2">{order.discountCode}</Badge>
                </p>
              )}
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-50">Order Items:</h3>
          <div className="space-y-3">
            {order.orderItems.length > 0 ? (
              order.orderItems.map((item: OrderItem) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.quantity} x {item.product.name}
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No items found for this order.</p>
            )}
          </div>

          {order.deliveryType === 'DELIVERY' && order.shippingAddress && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-50">Shipping Address:</h3>
              <address className="not-italic text-gray-700 dark:text-gray-300">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              </address>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
