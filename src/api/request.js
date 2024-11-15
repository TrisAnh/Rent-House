// src/api/auth.js
import axiosInstance from "./axiosInstance";

export const createRequest = (data) => {
  return axiosInstance.post("/request/create", data);
};

export const getRequest = (renterId) => {
  return axiosInstance.get(`/request/renter/${renterId}`);
};
export const updateAcceptRequest = (id) => {
  return axiosInstance.put(`/request/${id}/accept`);
};
export const updateDeclineRequest = (id) => {
  return axiosInstance.put(`/request/${id}/decline`);
};
export const updateDeleteRequest = (id) => {
  return axiosInstance.delete(`/request/${id}`);
};
