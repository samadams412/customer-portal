// src/types/product.ts
// This file centralizes interfaces for various entities used across the application.

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  createdAt: string; // Assuming this comes as a string from your API/Prisma
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  productId: string;
  product: Product; // Includes nested product details
}

export interface Order {
  id: string;
  orderDate: string; // Will parse to Date object for display
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  discountCode?: string | null;
  discountAmount?: number | null;
  deliveryType: 'DELIVERY' | 'PICKUP';
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddressId?: string | null;
  shippingAddress?: Address; // Includes nested address details if delivery
  orderItems: OrderItem[];
}
