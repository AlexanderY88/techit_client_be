import axios from "axios";
import Product from "../interfaces/Product";

const api: string = (process.env.REACT_APP_API || "http://localhost:8000/api") + "/products";

// Helper function to get auth token
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      "auth-token": token
    }
  };
};

export function getAllProducts() {
  return axios.get(api, getAuthHeaders());
}

export function getProductById(id: string) {
  return axios.get(`${api}/${id}`, getAuthHeaders());
}

export function addProduct(newProduct: Product) {
  return axios.post(api, newProduct, getAuthHeaders());
}

export function updateProduct(id: string, updatedProduct: Product) {
  return axios.put(`${api}/${id}`, updatedProduct, getAuthHeaders());
}

export function deleteProduct(id: string) {
  return axios.delete(`${api}/${id}`, getAuthHeaders());
}
