import useSWR from "swr";

type CategoriesResponse = { categories: string[] };

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProductCategories() {
  const { data, error, isLoading } = useSWR<CategoriesResponse>(
    "/api/products/categories",
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    categories: data?.categories ?? [],
    error,
    isLoading,
  };
}
