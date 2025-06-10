import axiosInstance from "./axiosInstance";

export const createChat = (data) => {
  return axiosInstance.post("/chat/create", data);
};
