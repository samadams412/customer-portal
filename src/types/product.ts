export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}