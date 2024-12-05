// src/api/post.js
import axiosInstance from "./axiosInstance";
export const createPost = (postData) => {
  return axiosInstance.post("/post/create", postData);
};
export const getTopViewedPosts = (data) => {
  return axiosInstance.get("/post/top-views", data);
};
export const searchPost = (params) => {
  return axiosInstance.get("/post/search", { params });
};
export const getAllPosts = () => {
  return axiosInstance.get("/post/getAll");
};
export const getPostById = (id) => {
  return axiosInstance.get(`/post/${id}`);
};
export const getPostByIdLandlord = (landlordId) => {
  return axiosInstance.get(`/post/landlord/${landlordId}`);
};
export const updatePostById = (id, formData) => {
  return axiosInstance.put(`/post/${id}`, formData);
};
export const deletePostById = (id) => {
  return axiosInstance.delete(`/post/${id}`);
};
export const getPostActive = (data) => {
  return axiosInstance.get("/post/getActivePost", data);
};
export const getPostByRoomType = (roomType) => {
  return axiosInstance.get(`/post/room-type/${roomType}`);
};
export const getRoomTypes = () => {
  return axiosInstance.get("/post/get-room-types");
};
export const getPostByDistrict = async (district) => {
  return axiosInstance.get(`/post/district/${district}`);
};
export const getDistricts = async () => {
  return axiosInstance.get("/post/districts");
};
