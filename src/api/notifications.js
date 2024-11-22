import axiosInstance from "./axiosInstance";

export const getNotification = (userId) => {
  return axiosInstance.get(`/notification/user/${userId}`);
};
