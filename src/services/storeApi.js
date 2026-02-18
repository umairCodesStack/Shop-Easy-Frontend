import { API_BASE_URL } from "../utils/constants";
import { getAuthToken } from "./authApi";

export async function createStore(storeData) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/Store/addStore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(storeData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create store");
  }
}
