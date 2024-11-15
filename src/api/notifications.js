import axiosInstance from "./axiosInstance";

export const getNotification = () => {
  return axiosInstance.get("/notification/user");
};
