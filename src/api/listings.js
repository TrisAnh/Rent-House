// src/api/listings.js
import axiosInstance from "./axiosInstance";
export const getListings = () => {
  return axiosInstance.get("/listings");
};

export const getListingById = (id) => {
  return axiosInstance.get(`/listings/${id}`);
};
