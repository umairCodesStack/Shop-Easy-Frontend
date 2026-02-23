import { useQuery } from "@tanstack/react-query";
import { getAllStores } from "../services/storeApi";

export function useGetAllStores() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stores"],
    queryFn: getAllStores,
  });
  return { data, isLoading, error };
}
