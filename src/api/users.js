import axiosInstance from "./axiosInstance";

export const getCurrentUser = () => {
  return axiosInstance.get("auth/me");
};
export const getUserById = (id) => {
  return axiosInstance.get(`auth/user/${id}`);
};
