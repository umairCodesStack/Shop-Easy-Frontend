import { useQuery } from "@tanstack/react-query";
import { getStoreCustomers } from "../services/storeApi";

export function useGetCustomers(vendorId) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["storeCustomers", vendorId],
    queryFn: () => getStoreCustomers(vendorId), // ⭐ Arrow function without parameters
    enabled: !!vendorId, // Only run if vendorId exists
  });
  return { data, isLoading, error };
}
