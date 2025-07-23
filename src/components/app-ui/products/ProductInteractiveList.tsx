"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components/app-ui/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/interface"; 

const productsPerPage = 16;

const ProductInteractiveList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const { products, isLoading, error } = useProducts({
    search: debouncedSearch,
    sortBy,
    sortOrder,
    category,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, sortOrder, category]);

  const validProducts: Product[] = Array.isArray(products) ? products : [];

  const totalPages = Math.ceil(validProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = validProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background p-8 font-sans text-foreground">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Our Products</h1>

        {/* Controls */}
        <div className="bg-card p-6 rounded-lg shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            id="search"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 p-3 border border-border rounded-md bg-input dark:bg-primary focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-800"
          />

          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-1/4 p-3 border border-border rounded-md bg-input dark:bg-primary focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-800"
          >
            <option value="">All Categories</option>
            <option value="meat">Meat</option>
            <option value="dairy">Dairy</option>
            <option value="produce">Produce</option>
            <option value="dry goods">Dry Goods</option>
          </select>

          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-1/4 p-3 border border-border rounded-md bg-input dark:bg-primary focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-800"
          >
            <option value="">Sort By...</option>
            <option value="price">Price</option>
            <option value="inStock">In Stock</option>
          </select>

          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full sm:w-1/4 p-3 border border-border rounded-md bg-input dark:bg-primary focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-800"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: productsPerPage }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-destructive text-lg">
            {error.message || "Failed to load products."}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && paginatedProducts.length === 0 && (
          <div className="text-center text-muted-foreground text-lg">No products found.</div>
        )}

        {/* Product Grid */}
        {!isLoading && paginatedProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  />
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductInteractiveList;
