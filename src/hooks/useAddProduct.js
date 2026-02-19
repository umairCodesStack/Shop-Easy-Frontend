import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../services/productsApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useAddProduct() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: addProduct,
    error,
    isLoading,
  } = useMutation({
    mutationKey: ["addProduct"],
    mutationFn: (productData) => createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries(["storeProducts"]);
      toast.success("Product added successfully! 🎉");
      navigate("/vendor/products");
    },
    onError: (error) => {
      console.error("Error adding product:", error);
      toast.error(error.message || "Failed to add product");
    },
  });
  return { addProduct, error, isLoading };
}
