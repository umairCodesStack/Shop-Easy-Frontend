import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct as deleteProductApi } from "../services/productsApi";
import toast from "react-hot-toast";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteProductMutate,
    error,
    isPending,
  } = useMutation({
    mutationFn: ({ productId, imageUrls }) =>
      deleteProductApi(productId, imageUrls),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeProducts"] });
      toast.success("Product deleted successfully!");
    },

    onError: (err) => {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    },
  });

  return { deleteProductMutate, error, isLoading: isPending };
}
