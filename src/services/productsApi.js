import { API_BASE_URL } from "../utils/constants";
export default async function getProducts() {
  let url = `${API_BASE_URL}/odata/Product`;

  try {
    console.log("Fetching:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getTrendingProducts() {
  const url = `${API_BASE_URL}/odata/Product?$filter=Rating gt 4.5&$orderby=Rating desc&$top=10`;

  try {
    console.log("Fetching trending products:", url);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Trending products data received:", data);
    return data.value || data;
  } catch (error) {
    console.error("Error fetching trending products:", error);
    throw error;
  }
}
export async function getHotDealsProduct() {
  const url = `${API_BASE_URL}/odata/Product?$filter=tolower(Tag) eq 'hot deal'`;

  try {
    console.log("Fetching hot deals products:", url);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Hot deals products data received:", data);
    return data.value || data;
  } catch (error) {
    console.error("Error fetching hot deals products:", error);
    throw error;
  }
}
export async function getCategories() {
  const url = `${API_BASE_URL}/odata/Product/getCatagories`;

  try {
    console.log("Fetching categories:", url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Categories data received:", data);
    return data.value || data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
export async function getProductById(id) {
  const url = `${API_BASE_URL}/odata/Product/getProductById?product_id=${id}`;
  try {
    console.log("Fetching product by ID:", url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Product data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
}
