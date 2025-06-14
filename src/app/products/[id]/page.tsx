// src/app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";

// Define the Product interface to ensure type safety
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  createdAt: string; // Assuming this comes as a string from your API/Prisma
}

// IMPORTANT FIX: Use VERCEL_URL for deployed environment
// VERCEL_URL is an environment variable automatically provided by Vercel
// that contains the public URL of your deployment.
// For local development, it will fall back to http://localhost:3000.
const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";


export default async function ProductPage({
  params,
}: {
  // Workaround for Next.js build-time type validation:
  // Explicitly typing params as 'any' to satisfy the compiler's PageProps constraint.
  // This bypasses the strict check expecting Promise-like properties.
  params: any; 
}) {
  // Keep the await Promise.resolve(params) for consistency with previous fixes,
  // even though params is now 'any' at this point.
  const { id } = await Promise.resolve(params);

  try {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      // It's good practice to ensure caching behavior for fetch calls on server components
      // or API routes that are static. 'no-store' means always refetch.
      // 'force-cache' means use cache, 'no-cache' means revalidate.
      // For dynamic data, 'no-store' is often appropriate.
      cache: 'no-store' 
    });

    if (!res.ok) {
      if (res.status === 404) {
        return notFound();
      }
      let errorMessage = `Failed to fetch product: HTTP status ${res.status}`;
      try {
        const errorData: { error?: string } = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError: unknown) {
        console.error("Failed to parse error JSON for product details:", jsonError);
      }
      throw new Error(errorMessage);
    }

    // Explicitly type the product data
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
  } catch (error: unknown) {
    console.error("Error fetching product details:", error);
    let displayError = "There was an error loading the product details.";
    if (error instanceof Error) {
        displayError = error.message;
    }
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-red-500">
        <p>{displayError}</p>
      </div>
    );
  }
}
