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

// FIX: Added CartItem interface
export interface CartItem {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  product: Product; // Include nested product details
  // Add other fields from your Prisma CartItem model like createdAt, updatedAt if needed for client-side
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
  deliveryType: 'DELIVERY' | 'PICKUP'; // These are string literals matching Prisma enums
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'; // String literals matching Prisma enums
  shippingAddressId?: string | null;
  shippingAddress?: Address; // Includes nested address details if delivery
  orderItems: OrderItem[];
}
