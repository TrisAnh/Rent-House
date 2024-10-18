// src/api/users.js
import axiosInstance from "./axiosInstance";

export const getCurrentUser = (data) => {
  return axiosInstance.get("auth/me", data);
};
export const getUserById = (id) => {
  return axiosInstance.get(`auth/user/${id}`);
};
