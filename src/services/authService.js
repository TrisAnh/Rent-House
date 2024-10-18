// src/services/authService.js
import { login as loginApi, register as registerApi } from "../api/auth";

export const authenticateUser = async (credentials) => {
  try {
    const response = await loginApi(credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await registerApi(data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
