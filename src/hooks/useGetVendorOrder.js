import { useQuery } from "@tanstack/react-query";
import { getOrdersByVendorId } from "../services/orderApi";

export function useGetVendorOrder(vendorId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["vendorOrders", vendorId],
    queryFn: () => getOrdersByVendorId(vendorId),
    enabled: !!vendorId,
    staleTime: 30000, // Data is fresh for 30 seconds
    cacheTime: 300000, // Cache persists for 5 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
    retry: 2, // Retry failed requests twice
  });

  return { data, isLoading, error, refetch };
}
