import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast"; // or your toast library
import { signup as signupApi } from "../services/authApi";
export function useSignupVendor() {
  const mutation = useMutation({
    mutationKey: ["signupVendor"],
    mutationFn: (userData) => signupApi(userData),
    // Remove onSuccess and onError from here
  });

  return {
    signup: mutation.mutate,
    signupAsync: mutation.mutateAsync, // Provide both
    error: mutation.error,
    isLoading: mutation.isPending,
    data: mutation.data,
    isSuccess: mutation.isSuccess,
  };
}
