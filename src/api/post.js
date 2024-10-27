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
