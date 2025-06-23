// src/components/order-card.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order, OrderItem } from "@/types/product"; // Import Order and OrderItem interfaces

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">
          Order #{order.id.substring(0, 8)}... - Total: ${order.totalAmount.toFixed(2)}
        </CardTitle>
        <CardDescription>
          Placed on: {new Date(order.orderDate).toLocaleDateString()} | Status: {order.status} | Type: {order.deliveryType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-md font-semibold mb-2">Items:</h3>
        <ul className="list-disc pl-5 mb-3 text-sm">
          {order.orderItems.map((item: OrderItem) => ( // Explicitly type item here
            <li key={item.id}>
              {item.quantity} x {item.product.name} (${item.priceAtPurchase.toFixed(2)} each)
            </li>
          ))}
        </ul>
        {order.shippingAddress && (
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            <h3 className="font-semibold">Shipping To:</h3>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          </div>
        )}
        <div className="mt-4 text-right">
          <Link href={`/orders/${order.id}`}>
            <Button variant="link" size="sm">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
