import { useQuery } from "@tanstack/react-query";
import { getProductsByUserId } from "../services/productsApi";

export function useGetStoreProducts(storeId) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["storeProducts", storeId],
    queryFn: () => getProductsByUserId(storeId),
    onError: (error) => {
      console.error("Error fetching store products:", error);
    },
  });
  return { products: data, error, isLoading };
}
