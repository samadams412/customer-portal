// src/app/product/ProductInteractiveList.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/interface';
// Import ProductCard from its dedicated file in the components directory
import { ProductCard } from '@/components/app-ui/products/ProductCard';

// ProductInteractiveList Component: Handles search, sort, and displays product cards
const ProductInteractiveList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>(''); // 'price' or 'inStock'
  const [sortOrder, setSortOrder] = useState<string>('asc'); // 'asc' or 'desc'  

  // useEffect to fetch products based on search, sortBy, and sortOrder changes
  //TODO: Look into library like SWR and React Query to get rid of useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading to true at the start of fetch
      setError(null);   // Clear any previous errors

      try {
        // Construct URLSearchParams for query parameters
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        if (sortBy) {
          params.append('sortBy', sortBy);
          params.append('order', sortOrder);
        }

        const queryString = params.toString();
        // Append query string to the API endpoint if it exists
        const url = `/api/products${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);

        // Check if the response was successful
        if (!response.ok) {
          // Throw an error with the status for better debugging
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Product[] = await response.json(); // Parse JSON response
        setProducts(data); // Update products state
      } catch (e: any) {
        console.error("Failed to fetch products:", e); // Log the error
        setError(`Failed to load products: ${e.message}`); // Set user-friendly error message
      } finally {
        setLoading(false); // Set loading to false once fetching is complete (success or failure)
      }
    };

    // Call the fetch function
    fetchProducts();
  }, [searchQuery, sortBy, sortOrder]); // Re-run effect when these dependencies change

  return (
    <div className="min-h-screen bg-background p-8 font-sans text-foreground">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Our Products</h1>

        {/* Search and Sort Controls */}
        <div className="bg-card p-6 rounded-lg shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search Input Field */}
          <div className="w-full sm:w-1/2">
            <label htmlFor="search" className="sr-only">Search Products</label>
            <input
              type="text"
              id="search"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full sm:w-1/4">
            <label htmlFor="sortBy" className="sr-only">Sort By</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="" className="dark:text-black">Sort By...</option> {/* Default option */}
              <option value="price" className="dark:text-black">Price</option>
              <option value="inStock" className="dark:text-black">In Stock</option>
            </select>
          </div>

          {/* Sort Order Dropdown */}
          <div className="w-full sm:w-1/4">
            <label htmlFor="sortOrder" className="sr-only">Sort Order</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-3 border border-border rounded-md bg-input focus:outline-none focus:ring-2 focus:ring-primary "
            >
              <option value="asc" className="dark:text-black">Ascending</option>
              <option value="desc" className="dark:text-black">Descending</option>
            </select>
          </div>
        </div>

        {/* Conditional Rendering: Loading, Error, or Products Grid */}
        {loading && (
          <div className="text-center text-muted-foreground text-lg">Loading products...</div>
        )}

        {error && (
          <div className="text-center text-destructive text-lg p-4 bg-destructive/10 border border-destructive rounded-md">
            Error: {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center text-muted-foreground text-lg">No products found. Try a different search or sort option.</div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Map over products and render ProductCard for each */}
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInteractiveList;
