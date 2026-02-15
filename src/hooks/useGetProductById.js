import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/productsApi";

export default function useGetProductById(id) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Product", id],
    queryFn: () => getProductById(id),
  });
  return { data, isLoading, error };
}
