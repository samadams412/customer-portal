"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components/app-ui/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/interface";

const productsPerPage = 16;

// Builds a truncated page list: first, last, current ± 1, with "dots" for gaps.
function getPaginationRange(current: number, total: number): (number | "dots")[] {
  const range: (number | "dots")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      range.push(i);
    } else if (range[range.length - 1] !== "dots") {
      range.push("dots");
    }
  }
  return range;
}

// e.g. "home-decoration" -> "Home Decoration"
const formatCategoryLabel = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ProductInteractiveList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const { categories } = useProductCategories();

  const { products, total, isLoading, error } = useProducts({
    search: debouncedSearch,
    sortBy,
    sortOrder,
    category,
    page: currentPage,
    pageSize: productsPerPage,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, sortOrder, category]);

  const paginatedProducts: Product[] = Array.isArray(products) ? products : [];

  const totalPages = Math.max(1, Math.ceil(total / productsPerPage));

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-8 text-foreground">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8">Shop all</h1>

        {/* Controls */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            id="search"
            aria-label="Search products"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 h-11 px-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />

          <select
            id="category"
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-1/4 h-11 px-3 border border-input rounded-md bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {formatCategoryLabel(c)}
              </option>
            ))}
          </select>

          <select
            id="sortBy"
            aria-label="Sort by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-1/4 h-11 px-3 border border-input rounded-md bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">Sort By...</option>
            <option value="price">Price</option>
            <option value="inStock">In Stock</option>
          </select>

          <select
            id="sortOrder"
            aria-label="Sort order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full sm:w-1/4 h-11 px-3 border border-input rounded-md bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: productsPerPage }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-xl bg-muted" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                  {getPaginationRange(currentPage, totalPages).map((page, index) =>
                    page === "dots" ? (
                      <PaginationItem key={`dots-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
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
