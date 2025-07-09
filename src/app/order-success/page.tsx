'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Order } from '@/types/interface';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error('Failed to load order');
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error('Order fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, session?.user?.id]);

  if (loading || status === 'loading' || !order || !orderId) {
    return null;
  }

  const isDelivery = order.deliveryType === 'DELIVERY';

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-xl"
      >
        <Card className="shadow-2xl bg-white dark:bg-gray-800">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="mx-auto mb-4"
            >
              <div className="rounded-full bg-green-500 p-4 text-white w-16 h-16 flex items-center justify-center">
                ✓
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-semibold text-green-600 dark:text-green-400">
              Order Placed Successfully!
            </CardTitle>
            <p className="text-muted-foreground mt-2">Order #{order.id}</p>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <p className="text-lg text-gray-800 dark:text-gray-200">
              Your order is now{' '}
              <Badge className="bg-blue-600 text-white">{order.status}</Badge>
            </p>

            <p className="text-sm text-muted-foreground">
              {isDelivery
                ? "We're preparing your order for delivery. You’ll receive tracking info soon."
                : "We'll notify you when your order is ready for pickup."}
            </p>

            <div className="text-left mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Placed on:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
              <p><strong>Delivery Type:</strong> {order.deliveryType}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6">
              <Button onClick={() => router.push(`/orders/${order.id}`)} variant="default">
                View Order Details
              </Button>
              <Button onClick={() => router.push('/dashboard')} variant="secondary">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

// ✅ This is the default export for the page
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <main className="container mx-auto p-6 min-h-screen">
        <Skeleton className="h-12 w-2/3 bg-gray-200 dark:bg-gray-700 mb-4" />
        <Skeleton className="h-60 w-full bg-gray-200 dark:bg-gray-700" />
      </main>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
