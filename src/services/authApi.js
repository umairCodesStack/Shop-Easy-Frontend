import { API_BASE_URL } from "../utils/constants";
import {
  getItemWithExpiry,
  setItemWithExpiry,
  setItemWithServerExpiry,
} from "../utils/localStorageUtils";

export async function signup(userData) {
  const response = await fetch(`${API_BASE_URL}/api/UserAuth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  // Parse the response
  const data = await response.json();
  // Store token with server-provided expiry
  if (data.accessToken && data.expiresAt) {
    console.log("Token expires at:", data.expiresAt);
    setItemWithServerExpiry("authToken", data.accessToken, data.expiresAt);
    localStorage.setItem("tokenExpiresAt", data.expiresAt);
  }
  // Check if the response is not OK (status code 400-599)
  if (!response.ok) {
    // Throw error so React Query catches it in onError
    throw new Error(data.message || "Signup failed");
  }

  // Return the parsed data
  return data;
}
export async function login(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/UserAuth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    console.log("Login response status:", response.status);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    if (credentials.rememberMe && data.accessToken) {
      const expiryTime = new Date(data.expiresAt).getTime();
      const now = new Date().getTime();
      const minutesUntilExpiry = Math.floor((expiryTime - now) / 1000 / 60);
      console.log(`Token valid for ${minutesUntilExpiry} minutes`);

      setItemWithExpiry("authToken", data.accessToken, minutesUntilExpiry);

      localStorage.setItem("tokenExpiresAt", data.expiresAt);
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw the error to be caught by React Query
  }
}
export async function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenExpiresAt");
}
export async function deleteAccount(userId) {
  const response = await fetch(
    `${API_BASE_URL}/api/UserAuth/deleteUser?userId=${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete account");
  }
  return true;
}
export function getAuthToken() {
  return getItemWithExpiry("authToken");
}
