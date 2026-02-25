import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../services/orderApi";
import toast from "react-hot-toast";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["updateOrderStatus"],
    mutationFn: ({ orderId, newStatus }) =>
      updateOrderStatus(orderId, newStatus),
    onError: () => {
      toast.error("Failed to Update Order status");
    },
    onSuccess: () => {
      toast.success("Order Status Updated Successfully");

      // Force refetch all matching queries
      queryClient.refetchQueries({
        queryKey: ["vendorOrders"],
      });

      queryClient.refetchQueries({
        queryKey: ["customerOrders"],
      });
      queryClient.refetchQueries({
        queryKey: ["storeProducts"],
      });
    },
  });
  return { mutate, isLoading, error };
}
