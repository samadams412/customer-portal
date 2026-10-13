// src/components/order-card.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order, OrderItem } from "@/types/interface"; // Import Order and OrderItem interfaces

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold flex flex-wrap items-center gap-2">
          Order #{order.id.substring(0, 8)}... - Total: ${order.totalAmount.toFixed(2)}
          <Badge className={
            order.status === 'DELIVERED' ? 'bg-success text-success-foreground' :
            order.status === 'SHIPPED' ? 'bg-cta text-cta-foreground' :
            order.status === 'PROCESSING' ? 'bg-primary text-primary-foreground' :
            order.status === 'CANCELLED' ? 'bg-destructive text-destructive-foreground' :
            'bg-muted text-muted-foreground'
          }>{order.status}</Badge>
        </CardTitle>
        <CardDescription>
          Placed on: {new Date(order.orderDate).toLocaleDateString()} | Type: {order.deliveryType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-heading text-md font-semibold mb-2">Items:</h3>
        <ul className="list-disc pl-5 mb-3 text-sm text-muted-foreground">
          {order.orderItems.map((item: OrderItem) => ( // Explicitly type item here
            <li key={item.id}>
              {item.quantity} x {item.product.name} (${item.priceAtPurchase.toFixed(2)} each)
            </li>
          ))}
        </ul>
        {order.shippingAddress && (
          <div className="mt-2 text-sm text-muted-foreground">
            <h3 className="font-heading font-semibold text-foreground">Shipping To:</h3>
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
