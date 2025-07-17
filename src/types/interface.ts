// src/types/product.ts
// This file centralizes interfaces for various entities used across the application.

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null; // Changed from imageUrl?: string; to imageUrl: string | null;
  inStock: boolean;
  createdAt: string; 
  updatedAt: string; 
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


export interface CartItem {
  id: string; // Client-generated unique ID for this cart entry (e.g., using crypto.randomUUID())
  quantity: number;
  productId: string;
  product: Product; // Include nested product details directly

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
  orderDate: string;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  deliveryType: 'DELIVERY' | 'PICKUP';
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddressId?: string | null;
  shippingAddress?: Address;
  orderItems: OrderItem[];

  // Update these:
  discountCode?: {
    id: string;
    code: string;
    percentage: number;
  } | null;

  // Add this if you want to display calculated value
  discountAmount?: number;
}
