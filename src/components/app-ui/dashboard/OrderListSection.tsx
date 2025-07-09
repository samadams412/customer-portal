// src/components/app-ui/dashboard/OrderListSection.tsx
'use client';

import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import { OrderCard } from "@/components/app-ui/dashboard/OrderCard";
import { Order } from "@/types/interface";
import { Button } from "@/components/ui/button";

interface OrderListSectionProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export function OrderListSection({
  orders,
  loading,
  error,
}: OrderListSectionProps) {
  const recentOrders = orders
    .slice() // copy to avoid mutating the prop
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 1); // take most recent 2

  return (
    <section className="rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
        Your Recent Orders
      </h2>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">
          No orders found. Start shopping!
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Show more button only if there are more than 2 orders */}
          {orders.length > 1 && (
            <div className="mt-4 text-center">
              <Link href="/orders">
                <Button variant="outline">Show All Orders</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
