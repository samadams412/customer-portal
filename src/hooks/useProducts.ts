import useSWR from "swr";
import qs from "query-string";
import { Product } from "@/types/interface";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProducts({
  search,
  sortBy,
  sortOrder,
  category,
}: {
  search: string;
  sortBy: string;
  sortOrder: string;
  category?: string;
}) {
  const query = qs.stringify({ search, sortBy, order: sortOrder, category });
  const { data, error, isLoading } = useSWR<Product[]>(`/api/products?${query}`, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    products: data ?? [],
    error,
    isLoading,
  };
}
