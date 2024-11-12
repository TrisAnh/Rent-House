// src/api/auth.js
import axiosInstance from "./axiosInstance";

export const createRequest = (data) => {
  return axiosInstance.post("/request/create", data);
};

export const getRequest = (renterId) => {
  return axiosInstance.get(`/request/renter/${renterId}`);
};
