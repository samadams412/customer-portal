// src/app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
// import { headers } from 'next/headers'; // Only needed if you implement Option 2 with credentials

// Define the Product interface to ensure type safety
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  createdAt: string; // Assuming this comes as a string from your API/Prisma
}

// Re-introducing BASE_URL with more robust detection for both local and deployment.
// VERCEL_URL is an environment variable automatically provided by Vercel for the deployment URL.
// Use 'https://' for production and 'http://' for local development.
const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
const HOST = process.env.VERCEL_URL || 'localhost:3000'; // Fallback to localhost:3000 for local dev
const BASE_URL = `${PROTOCOL}${HOST}`;

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
    // FIX: Use the constructed BASE_URL to ensure a fully qualified URL for fetch.
    // This prevents "Failed to parse URL" locally and ensures correct domain on Vercel.
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      cache: 'no-store' // Ensure fresh data, important for dynamic content
      // If you needed to forward credentials (e.g., auth cookies), you would add:
      // credentials: 'include',
      // headers: {
      //   Cookie: headers().get('cookie') ?? '', // Requires 'next/headers' import
      // },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return notFound();
      }

      let errorMessage = `Failed to fetch product: HTTP status ${res.status}`;
      try {
        const contentType = res.headers.get("content-type");
        // BONUS FIX: Safely parse JSON or get plain text error response
        if (contentType && contentType.includes("application/json")) {
          const errorData: { error?: string } = await res.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          // If not JSON, try to read as text and log for debugging
          const textResponse = await res.text();
          console.error("Non-JSON error response from API:", textResponse);
          errorMessage = `API returned non-JSON error for status ${res.status}. Check console for details.`;
        }
      } catch (jsonError: unknown) {
        console.error("Failed to parse error JSON for product details:", jsonError);
        // Fallback error message if even parsing fails
        errorMessage = `Failed to parse API error response for status ${res.status}.`;
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
