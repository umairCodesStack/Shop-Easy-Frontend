import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePassword as updateUserPasswordApi } from "../services/authApi";

export function useUpdateUserPassword() {
  const {
    mutateAsync: updateUserPassword,
    error,
    isLoading,
  } = useMutation({
    mutationKey: ["updateUserPassword"],
    mutationFn: (passwordData) => updateUserPasswordApi(passwordData),
    onError: (error) => {
      console.error("❌ Error updating user password:", error);
      toast.error(error.message || "Failed to update password");
    },
    onSuccess: (data) => {
      console.log("✅ User password updated successfully:", data);
      toast.success("Password updated successfully! 🎉");
    },
  });
  return { updateUserPassword, error, isLoading };
}
