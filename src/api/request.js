import axiosInstance from "./axiosInstance";

export const createRequest = (data) => {
  return axiosInstance.post("/request/create", data);
};

export const getRequest = (renterId) => {
  return axiosInstance.get(`/request/renter/${renterId}`);
};
export const getRequestByPostId = (postId) => {
  return axiosInstance.get(`/request/post/${postId}`);
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
export const getRequestByUserId = (userId) => {
  return axiosInstance.get(`/request/user/${userId}`);
};
export const updateRequest = (id, updateData) => {
  return axiosInstance.put(`/request/${id}`, updateData);
};
