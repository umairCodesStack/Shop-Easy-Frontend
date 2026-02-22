import { useMutation } from "@tanstack/react-query";
import { createStore } from "../services/storeApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteAccount } from "../services/authApi";

export function useCreateStore() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["createStore"],
    mutationFn: (storeData) => createStore(storeData), // Pass entire object including files
    onError: async (error, variables) => {
      toast.error(error.message || "Failed to create store");

      // Rollback: delete user if store creation fails
      if (variables.ownerId) {
        try {
          await deleteAccount(variables.ownerId);

          toast.success("Account removed due to store creation failure");
        } catch (deleteError) {
          toast.error(
            "Failed to rollback user creation. Please contact support.",
          );
        }
      }

      navigate("/vendor/register");
    },
    onSuccess: (data) => {
      toast.success("Store created successfully! 🎉");
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
