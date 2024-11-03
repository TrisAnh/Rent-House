// src/api/auth.js
import axiosInstance from "./axiosInstance";

export const createRequest = (data) => {
  return axiosInstance.post("/request/create", data);
};
