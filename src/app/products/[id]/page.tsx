import { notFound } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/interface"; // Import Product interface from centralized types

// Re-introducing BASE_URL with more robust detection for both local and deployment.
// VERCEL_URL is an environment variable automatically provided by Vercel for the deployment URL.
// Use 'https://' for production and 'http://' for local development.
const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
const HOST = process.env.VERCEL_URL || 'localhost:3000'; // Fallback to localhost:3000 for local dev
const BASE_URL = `${PROTOCOL}${HOST}`;

export default async function ProductPage({
  params,
}: {
  // FIX: Revert to 'any' for params type and use Promise.resolve()
  // This satisfies Next.js's internal PageProps constraint for dynamic routes.
  params: any; 
}) {
  // Ensure params is awaited to correctly extract id, satisfying the runtime behavior
  // expected by Next.js when params is typed as 'any'.
  const { id } = await Promise.resolve(params); 

  // Perform the initial fetch and 404 check OUTSIDE the general try/catch.
  // This ensures that notFound() throws its special error directly to Next.js's
  // routing layer, triggering the not-found.tsx page.
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    cache: 'no-store' // Ensure fresh data, important for dynamic content
  });

  if (res.status === 404) {
    //console.log("Product not found (404 response received), triggering notFound().");
    return notFound(); // Trigger Next.js's not-found page here
  }

  let product: Product | null = null;
  let displayError: string | null = null;

  try {
    // Now, only try to parse JSON and handle non-404 HTTP errors or parsing errors.
    if (!res.ok) {
      let errorMessage = `Failed to fetch product: HTTP status ${res.status}`;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData: { error?: string } = await res.json();
        errorMessage = errorData.error || errorMessage;
      } else {
        const textResponse = await res.text();
        console.error("Non-JSON error response from API:", textResponse);
        errorMessage = `API returned non-JSON error for status ${res.status}. Check console for details.`;
      }
      throw new Error(errorMessage);
    }

    // Explicitly type the product data
    product = await res.json();

  } catch (error: unknown) {
    console.error("Error fetching or parsing product details:", error);
    displayError = "There was an error loading the product details.";
    if (error instanceof Error) {
      displayError = error.message;
    }
  }

  // Render error message if a non-404 error occurred during fetch or parsing
  // Note: Perhaps modularize this into its own Error Component
  if (displayError) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-red-500">
        <p>{displayError}</p>
      </div>
    );
  }

  // At this point, if product is still null, it indicates an unexpected scenario
  // where no error was caught but product data wasn't assigned.
  // This could happen if the API returns 200 OK but empty/invalid JSON that `await res.json()`
  // doesn't directly throw on, but results in an empty object that doesn't match `Product`.
  // As a safeguard, ensuring product exists before rendering its properties.
  if (!product) { 
      return (
          <div className="max-w-xl mx-auto p-6 text-center text-gray-500">
              <p>Product data could not be loaded. Please try again later.</p>
          </div>
      );
  }


  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-8">
      {product.imageUrl && (
        <div className="relative w-full h-80 mb-6 rounded-md overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill // Use 'fill' for responsive image sizing within a parent div
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority // Prioritize loading for LCP
          />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-50">{product.name}</h1>
      <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
        ${product.price.toFixed(2)}
      </p>
      <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
        <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </p>
      {/* Add more product details here as needed */}
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Added on: {new Date(product.createdAt).toLocaleDateString()}
      </p>

      {/* Example: Add a "Add to Cart" button (client component) */}
      {/* <AddToCartButton productId={product.id} /> */}
    </div>
  );
}
