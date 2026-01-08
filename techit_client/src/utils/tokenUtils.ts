import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  _id: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeToken(token);
  return payload ? payload._id : null;
};

export const isUserAdmin = (token: string): boolean => {
  const payload = decodeToken(token);
  return payload ? payload.isAdmin : false;
};