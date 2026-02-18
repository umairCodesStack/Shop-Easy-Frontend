import { useMutation } from "@tanstack/react-query";
import { createStore } from "../services/storeApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDeleteUser } from "./useDeleteUser";
import { deleteAccount } from "../services/authApi";

export function useCreateStore() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["createStore"],
    mutationFn: ({ storeData, userId }) => createStore(storeData),
    onError: async (error, variables) => {
      console.error("Error creating store:", error);
      toast.error(error.message || "Failed to create store");

      // Call delete user if store creation fails
      try {
        console.log("Deleting user due to store creation failure...");
        await deleteAccount(variables.userId);
        console.log("User deleted successfully");
      } catch (deleteError) {
        console.error("Failed to delete user:", deleteError);
      }

      navigate("/vendor/register");
    },
    onSuccess: () => {
      toast.success("Store created successfully!");
      navigate("/vendor/dashboard");
    },
  });

  return {
    createStore: mutation.mutateAsync,
    createStoreMutation: mutation.mutate,
    error: mutation.error,
    isLoading: mutation.isPending,
    data: mutation.data,
  };
}
