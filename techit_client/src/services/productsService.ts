import axios from "axios";
import Product from "../interfaces/Product";

const api: string = process.env.REACT_APP_API + "/products";

export function getAllProducts() {
  return axios.get(api);
}

export function getProductById(id: string) {
  return axios.get(`${api}/${id}`);
}

export function addProduct(newProduct: Product) {
  return axios.post(api, newProduct);
}

export function updateProduct(id: string, updatedProduct: Product) {
  return axios.put(`${api}/${id}`, updatedProduct);
}

export function deleteProduct(id: string) {
  return axios.delete(`${api}/${id}`);
}
