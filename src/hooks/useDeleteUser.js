import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../services/authApi";
import toast from "react-hot-toast";

export function useDeleteUser(userId) {
  const { mutate, error, isLoading } = useMutation({
    mutationKey: ["deleteUser", userId],
    mutationFn: (userId) => deleteAccount(userId),
    onError: (error) => {
      toast.error("Error deleting account");
    },
  });
  return { deleteUser: mutate, error, isLoading };
}
