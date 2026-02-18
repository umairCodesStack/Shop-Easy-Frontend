import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../services/authApi";

export function useDeleteUser(userId) {
  const { mutate, error, isLoading } = useMutation({
    mutationKey: ["deleteUser", userId],
    mutationFn: (userId) => deleteAccount(userId),
    onError: (error) => {
      console.error("Error deleting account:", error);
    },
  });
  return { deleteUser: mutate, error, isLoading };
}
