import axios from "axios";
import User from "../interfaces/User";

const api: string = (process.env.REACT_APP_API || "http://localhost:8000/api") + "/users";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      "auth-token": token
    }
  };
};

// login - for Login component (expects checkUser)
export function checkUser(user: User) {
  return axios.post(`${api}/login`, {
    email: user.email,
    password: user.password
  });
}

// register - for Register component (expects addUser)  
export function addUser(newUser: User) {
  return axios.post(`${api}/register`, newUser);
}

// Get current user info
export function getCurrentUser() {
  return axios.get(`${api}/me`, getAuthHeaders());
}

// Decode JWT token to get user info (including isAdmin)
export function getUserFromToken() {
  const token = sessionStorage.getItem("token");
  if (!token) return null;
  
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const payload = token.split('.')[1];
    // Decode base64
    const decodedPayload = JSON.parse(atob(payload));
    return {
      id: decodedPayload._id,
      isAdmin: decodedPayload.isAdmin
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// profile - needs auth token in header
export function getUserById() {
  // get userId from token instead of sessionStorage
  const token = sessionStorage.getItem("token");
  if (!token) return Promise.reject("User not logged in");
  
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    const userId = decodedPayload._id;
    
    // get request for user full details with auth header
    return axios.get(`${api}/${userId}`, getAuthHeaders());
  } catch (error) {
    return Promise.reject("Invalid token");
  }
};