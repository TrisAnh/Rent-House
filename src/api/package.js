import axiosInstance from "./axiosInstance";

export const getPackage = () => {
  return axiosInstance.get("/packages/history");
};