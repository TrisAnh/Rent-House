// src/api/post.js
import axiosInstance from "./axiosInstance";
export const createPost = (postData) => {
  return axiosInstance.post("/post/create", postData);
};
export const postTopView = (data) => {
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
export const updatePostById = (id, updatedData) => {
  return axiosInstance.put(`/post/${id}`, updatedData);
};
export const deletePostById = (id) => {
  return axiosInstance.delete(`/post/${id}`);
};
