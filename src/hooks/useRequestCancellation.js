import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestForCancellation } from "../services/orderApi";
import toast from "react-hot-toast";

export function useRequestCancellation() {
  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["requestCancelOrder"],
    mutationFn: ({ orderId, reason }) =>
      requestForCancellation(orderId, reason),
    onError: () => {
      toast.error("Failed to place cancellation request");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorOrders"] });
      queryClient.invalidateQueries({ queryKey: ["customerOrders"] });
    },
  });
  return { mutate, isLoading, error };
}
