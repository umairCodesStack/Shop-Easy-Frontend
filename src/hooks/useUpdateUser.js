import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast/headless";
import { updateUser as updateUserApi } from "../services/authApi";

export function useUpdateUser() {
  const {
    mutateAsync: updateUser,
    error,
    isLoading,
  } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (userData) => updateUserApi(userData),
    onError: (error) => {
      console.error("❌ Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    },
    onSuccess: (data) => {
      console.log("✅ User updated successfully:", data);
      toast.success("User updated successfully! 🎉");
    },
  });
  return { updateUser, error, isLoading };
}
