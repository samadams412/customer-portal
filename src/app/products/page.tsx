import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
};

export default async function ProductsPage() {
  const res = await fetch(process.env.PROD_URL + "/api/products", {
    next: { revalidate: 60 },
  });

  const products: Product[] = await res.json();

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="border rounded-lg p-4 hover:shadow-md transition"
        >
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
          )}
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
        </Link>
      ))}
    </div>
  );
}
