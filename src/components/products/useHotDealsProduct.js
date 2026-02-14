import { useQuery } from "@tanstack/react-query";
import { getHotDealsProduct } from "../../services/productsApi";

export default function useHotDealsProduct() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["hotDealsProduct"],
    queryFn: getHotDealsProduct,
  });
  return { data, isLoading, error };
}
