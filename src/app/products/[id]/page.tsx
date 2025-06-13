import { notFound } from "next/navigation";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
};

const BASE_URL = process.env.PROD_URL || "http://localhost:3000";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Workaround to satisfy the Next.js warning:
  // Although 'params' is typically synchronous, this pattern makes it 'await'ed.
  const { id } = await Promise.resolve(params);

  const res = await fetch(`${BASE_URL}/api/products/${id}`);

  if (!res.ok) return notFound();

  const product: Product = await res.json();

  return (
    <div className="max-w-xl mx-auto p-6">
      {product.imageUrl && (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={640}
          height={400}
          className="w-full h-auto object-cover rounded mb-4"
        />
      )}
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-lg text-muted-foreground mb-1">
        ${product.price.toFixed(2)}
      </p>
      <p className="text-sm">
        {product.inStock ? "In Stock" : "Out of Stock"}
      </p>
    </div>
  );
}
