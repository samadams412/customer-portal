'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types/interface';
import { OrderCard } from '@/components/app-ui/dashboard/OrderCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';


const ORDERS_PER_PAGE = 5;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting state
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'
  const [order, setOrder] = useState<'asc' | 'desc'>('desc'); // sort direction

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders?sortBy=${sortBy}&order=${order}`);
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await res.json();
        setOrders(data);
        setCurrentPage(1); // reset to first page if sort changes
      } catch (err) {
        setError((err as Error).message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sortBy, order]);

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {/* Sorting controls container */}
      <div className="flex gap-4 items-center mb-6">
    
        {/* Label and dropdown for "Sort By" */}
        <label className="text-sm font-medium text-white">
          Sort By:
          <select
            value={sortBy} // Controlled component: the current sorting field state ('date' or 'amount')
            onChange={(e) => setSortBy(e.target.value)} // When user selects a new option, update sortBy state
            className="ml-2 px-2 py-1 border rounded-md text-black bg-white" // Tailwind CSS styling for margin, padding, border, rounded corners
          >
            {/* Options for sorting criteria */}
            <option className="text-black" value="date">Order Date</option>
            <option className="text-black" value="amount">Total Amount</option>
          </select>
        </label>

        {/* Label and dropdown for "Order" (ascending or descending) */}
        <label className="text-sm font-medium text-white">
          Order:
          <select
            value={order} // Controlled component: current sort order state ('asc' or 'desc')
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')} // Update order state on change
            className="ml-2 px-2 py-1 border rounded-md text-black bg-white" // Similar styling as above
          >
            {/* Options for sort direction */}
            <option className="text-black" value="desc">Descending</option>
            <option className="text-black" value="asc">Ascending</option>
          </select>
        </label>

      </div>

      {/* Loading state */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
      ) : error ? (
        //Error message
        <p className="text-destructive text-center">{error}</p>
      ) : paginatedOrders.length === 0 ? (
        //No orders message
        <p className="text-muted-foreground text-center">You haven’t placed any orders yet.</p>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
