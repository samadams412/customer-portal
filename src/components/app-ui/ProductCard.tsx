import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";

// ProductCard component for better modularity
export function ProductCard({ product }: { product: Product }) {
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
          <p className="text-lg font-bold text-black dark:text-zinc-200 mb-2">
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