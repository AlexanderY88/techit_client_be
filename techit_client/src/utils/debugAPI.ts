// Debug API Configuration
console.log("Environment Variables:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("REACT_APP_API:", process.env.REACT_APP_API);

export const debugAPI = () => {
  const baseAPI = process.env.REACT_APP_API || "http://localhost:8000/api";
  console.log("Base API URL:", baseAPI);
  console.log("Products API:", baseAPI + "/products");
  console.log("Users API:", baseAPI + "/users");
  console.log("Carts API:", baseAPI + "/carts");
  return baseAPI;
};