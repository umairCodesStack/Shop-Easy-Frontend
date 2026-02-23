import { API_BASE_URL } from "../utils/constants";
import { getAuthToken } from "./authApi";

export async function createOrder(orderData) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("You are not Authorized to Perform this Action");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/Order/AddOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error("Failed to create orders");
    const result = await response.json();
    return result;
  } catch (e) {
    throw new Error(e.message);
  }
}
export async function getOrdersByVendorId(vendorId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/Order/GetOrders?vendorId=${vendorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
}
export const getOrdersByCustomerId = async (customerId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/api/Order/GetOrderSummary?userId=${customerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch customer orders");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
};
export async function requestForCancellation(orderId, reason) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("You are not authorized to perform this action");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/Order/RequestOrderCancellation?orderId=${orderId}&reason=${encodeURIComponent(reason)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to request cancellation");
  }
}
export async function updateOrderStatus(orderId, status) {
  const token = getAuthToken();
  console.log("New Status to set", status);
  if (!token) {
    throw new Error("You are not authorized to perform this action");
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/Order/UpdateOrderStatus?orderId=${orderId}&status=${status}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
    //const data = response.json();
    //alert(data);
    //return data;
  } catch (e) {
    console.error(e.message);
  }
}
