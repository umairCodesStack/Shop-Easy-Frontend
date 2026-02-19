import { useQuery } from "@tanstack/react-query";
import { getUserByEmail } from "../services/authApi";

export function useGetUser(email) {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getUser", email],
    queryFn: () => getUserByEmail(email),
    onError: (error) => {
      console.error("❌ Error fetching user data:", error);
    },
    onSuccess: (data) => {
      console.log("✅ User data fetched successfully:", data);
    },
  });
  return { user, error, isLoading };
}
