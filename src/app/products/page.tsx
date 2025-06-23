"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product"; // Import Product interface from centralized types

// Define an interface for the expected API error response structure
interface ApiResponseError {
  error: string; // Assuming your API returns an object with an 'error' property
}

// Create a separate component that uses useSearchParams
// This allows you to wrap it in Suspense in the main page
function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const currentSearch = searchParams.get("search") || "";
  const currentSortBy = searchParams.get("sortBy") || "";
  const currentOrder = searchParams.get("order") === "desc" ? "desc" : "asc";

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== currentSearch) {
        updateParams("search", searchQuery);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, currentSearch, updateParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (currentSearch) params.set("search", currentSearch);
        if (currentSortBy) params.set("sortBy", currentSortBy);
        if (currentOrder) params.set("order", currentOrder);

        const apiUrl = `/api/products?${params.toString()}`;
        //console.log("Fetching products from:", apiUrl);

        const res = await fetch(apiUrl);
        
        if (!res.ok) {
          let errorMessage = `HTTP error! status: ${res.status}`;
          try {
            const errorData: ApiResponseError = await res.json();
            errorMessage = errorData.error || errorMessage;
          } catch (jsonError: unknown) {
            console.error("Failed to parse error JSON:", jsonError);
            errorMessage = `HTTP error! status: ${res.status} (Could not parse error details)`;
          }
          throw new Error(errorMessage);
        }

        const data: Product[] = await res.json(); 
        setProducts(data);
      } catch (error: unknown) { 
        console.error("Failed to fetch products:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred while fetching products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentSearch, currentSortBy, currentOrder]);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={currentSortBy ? `${currentSortBy}:${currentOrder}` : ":"}
          onChange={(e) => {
            const [sort, ord] = e.target.value.split(":");
            const newParams = new URLSearchParams(Array.from(searchParams.entries()));

            if (sort) {
              newParams.set("sortBy", sort);
              newParams.set("order", ord);
            } else {
              newParams.delete("sortBy");
              newParams.delete("order");
            }
            router.push(`/products?${newParams.toString()}`);
          }}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value=":">Sort by</option>
          <option value="price:asc">Price (Low to High)</option>
          <option value="price:desc">Price (High to Low)</option>
          <option value="inStock:asc">Availability (Out of Stock First)</option>
          <option value="inStock:desc">Availability (In Stock First)</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No products {currentSearch ? `matching "${currentSearch}"` : "available"}.
            </p>
          ) : (
            products.map((product: Product) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      )}
    </main>
  );
}

// ProductCard component for better modularity
function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="block"> {/* Ensure Link is block-level */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden
                    transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
        {product.imageUrl && (
          <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden"> {/* Responsive height */}
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill // Use fill for responsive images in a container
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" // Image optimization
              className="object-cover transition-transform duration-300 hover:scale-110"
              priority={false} // Only prioritize LCP images
            />
          </div>
        )}
        <div className="p-4"> {/* Padding for content inside card */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-1 truncate">
            {product.name}
          </h2>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm">
            <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

// The main default export for the page
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
