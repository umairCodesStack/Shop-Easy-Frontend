import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../services/orderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useAddOrder() {
  const navigate = useNavigate();
  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["addedOrder"],
    mutationFn: (orderData) => createOrder(orderData),
    onSuccess: () => {
      toast.success("Order Created Successfully");
      navigate("/cart");
    },
    onError: () => toast.error("Failed to create order"),
  });
  return { mutate, isLoading, error };
}
