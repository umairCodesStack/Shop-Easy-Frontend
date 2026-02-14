import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTrendingProducts } from "../../services/productsApi";

export function useTrendingProduct() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trendingProduct"],
    queryFn: getTrendingProducts,
  });
  return { data, isLoading, error };
}
