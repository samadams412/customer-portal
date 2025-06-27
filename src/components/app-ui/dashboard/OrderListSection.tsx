// src/components/OrderListSection.tsx
// This component renders the section for displaying a user's order history.
// It handles loading, error, and empty states.

import { Skeleton } from "@/components/ui/skeleton";
import { OrderCard } from "@/components/app-ui/dashboard/OrderCard"; // Import the OrderCard component
import { Order } from "@/types/interface"; // Import the Order interface

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
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">Your Orders</h2>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">No orders found. Start shopping!</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      )}
    </section>
  );
}
