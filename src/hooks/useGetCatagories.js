import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/productsApi";

export default function useGetCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Categories"],
    queryFn: getCategories,
  });
  return { data, isLoading, error };
}
