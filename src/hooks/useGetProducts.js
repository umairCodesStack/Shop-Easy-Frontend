import { useQuery } from "@tanstack/react-query";
import getProducts from "../services/productsApi";

export default function useGetProduct() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Products"],
    queryFn: getProducts,
  });
  return { data, isLoading, error };
}
