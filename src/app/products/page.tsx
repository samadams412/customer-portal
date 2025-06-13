"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; 

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || ""); // Local state for immediate input feedback

  // Directly get parameters from searchParams (useMemo is not strictly needed as searchParams is stable)
  const currentSearch = searchParams.get("search") || "";
  const currentSortBy = searchParams.get("sortBy") || "";
  const currentOrder = searchParams.get("order") === "desc" ? "desc" : "asc"; // Ensure "asc" is default if not "desc"

  /**
   * Updates a specific URL parameter and navigates to the new URL.
   * This function is now primarily used for the search input.
   * @param key The key of the URL parameter to update (e.g., "search", "sortBy").
   * @param value The new value for the URL parameter.
   */
  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]); // searchParams is stable, so useCallback dependencies are fine

  // Debounce the search input to prevent excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only update the URL if the local searchQuery state is different from the URL's currentSearch
      // This prevents unnecessary router.push calls if the URL already reflects the input
      if (searchQuery !== currentSearch) {
        updateParams("search", searchQuery);
      }
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, currentSearch, updateParams]); // Depend on searchQuery and currentSearch for debounce logic

  // Effect to fetch products whenever currentSearch, currentSortBy, or currentOrder parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(""); // Clear previous errors on new fetch attempt
      try {
        const params = new URLSearchParams();
        // Only add parameters if they have a non-empty value
        if (currentSearch) params.set("search", currentSearch);
        if (currentSortBy) params.set("sortBy", currentSortBy);
        if (currentOrder) params.set("order", currentOrder); // 'asc' is default, so it's always set if sortBy is.

        // Construct the full API URL
        const apiUrl = `/api/products?${params.toString()}`;
        console.log("Fetching products from:", apiUrl); // Log the actual URL being fetched

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!res.ok) {
          // If the response is not OK, throw an error to be caught by the catch block
          throw new Error(data.error || `HTTP error! status: ${res.status}`);
        }
        setProducts(data);
      } catch (err: any) {
        console.error("Failed to fetch products:", err); // Log the error details
        setError(err.message || "An unknown error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentSearch, currentSortBy, currentOrder]); // Depend on the derived URL parameters from searchParams

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search Input with debounced state */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery} // Controlled component for immediate feedback
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Sort by dropdown */}
        <select
          // Correctly set the value to ":" when no sortBy is present,
          // otherwise use the combination of sortBy and order.
          value={currentSortBy ? `${currentSortBy}:${currentOrder}` : ":"}
          onChange={(e) => {
            const [sort, ord] = e.target.value.split(":");
            // Create a new URLSearchParams object based on current params
            const newParams = new URLSearchParams(Array.from(searchParams.entries()));

            if (sort) {
              // Set both sortBy and order if a sort option is selected
              newParams.set("sortBy", sort);
              newParams.set("order", ord);
            } else {
              // If "Sort by" (default) is selected, remove both sortBy and order parameters
              newParams.delete("sortBy");
              newParams.delete("order");
            }
            // Push the new URL with all parameters updated at once
            router.push(`/products?${newParams.toString()}`);
          }}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value=":">Sort by</option> {/* Default empty value */}
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
            products.map((product: any) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      )}
    </main>
  );
}

// ProductCard component for better modularity
function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-auto object-cover mb-3 rounded-md"
          />
        )}
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-gray-700">${product.price.toFixed(2)}</p>
        <p className="text-sm">
          <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </p>
      </div>
    </Link>
  );
}
