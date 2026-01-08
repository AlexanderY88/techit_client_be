import axios from "axios";
import Product from "../interfaces/Product";

// Ensure API URL always includes /api path
const baseAPI = process.env.REACT_APP_API || "http://localhost:8000/api";
const api: string = baseAPI + "/carts";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      "auth-token": token
    }
  };
};

// Helper function to get user ID from token
const getUserIdFromToken = () => {
  const token = sessionStorage.getItem("token");
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload._id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Add product to cart or update quantity
export function addToCart(productId: string, quantity: number = 1) {
  return axios.post(`${api}/add-product`, { productId, quantity }, getAuthHeaders());
}

// Remove product from cart completely
export function removeFromCart(productId: string) {
  return axios.delete(`${api}/remove-product/${productId}`, getAuthHeaders());
}

// Update product quantity in cart
export function updateCartQuantity(productId: string, quantity: number) {
  return axios.put(`${api}/update-quantity`, { productId, quantity }, getAuthHeaders());
}

// Create cart (keeping for compatibility)
export function createCart(userId: string) {
  return axios.post(api, { userId, products: [], isActive: true }, getAuthHeaders());
}

// get user cart
export function getUserCart() {
  return axios.get(api, getAuthHeaders());
}

// clear cart
export async function clearCart() {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error("User not logged in");
    }

    // get user cart
    const userCart = await axios.get(`${api}?userId=${userId}&isActive=true`, getAuthHeaders());
    
    if (!userCart.data || userCart.data.length === 0) {
      throw new Error("User cart not found");
    }

    // clear all products
    return axios.put(`${api}/${userCart.data[0]._id}`, {
      products: [],
    }, getAuthHeaders());
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}
