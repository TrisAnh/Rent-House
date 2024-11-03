import axiosInstance from "./axiosInstance";

export const createMessage = (data) => {
  return axiosInstance.post("/message/create", data);
};
export const getMessagesByChatId = (chatId) => {
  return axiosInstance.get(`/message/chat/${chatId}`);
};
