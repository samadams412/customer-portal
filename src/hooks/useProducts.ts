import useSWR from "swr";
import qs from "query-string";
import { Product } from "@/types/interface";

type ProductsResponse = { products: Product[]; total: number; page: number; pageSize: number };

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProducts({
  search,
  sortBy,
  sortOrder,
  category,
  page,
  pageSize,
}: {
  search: string;
  sortBy: string;
  sortOrder: string;
  category?: string;
  page: number;
  pageSize: number;
}) {
  const query = qs.stringify(
    {
      search,
      sortBy,
      order: sortOrder,
      category,
      page,
      pageSize,
    },
    { skipEmptyString: true, skipNull: true } // prevents `category=` if undefined
  );

  const { data, error, isLoading } = useSWR<ProductsResponse>(
    `/api/products?${query}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    error,
    isLoading,
  };
}
