import { useQuery } from "@tanstack/react-query";
import { getOrdersByCustomerId } from "../services/orderApi";

export default function useGetCustomerOrders(customerId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["customerOrders", customerId],
    queryFn: async () => {
      const result = await getOrdersByCustomerId(customerId);
      return result || [];
    },
    enabled: !!customerId,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });

  return { data, isLoading, error, refetch };
}
