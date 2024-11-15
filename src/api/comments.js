// src/api/comments.js
import { DataArrayTwoTone } from "@mui/icons-material";
import axiosInstance from "./axiosInstance";
export const getCommentByPostId = (postId) => {
  return axiosInstance.get(`/comment/post/${postId}`);
};

export const createComment = (data) => {
  return axiosInstance.post("comment/create", data);
};
export const updateComment = (id) => {
  return axiosInstance.put(`comment/${id}`);
};
export const deleteComment = (id) => {
  return axiosInstance.delete(`comment/delete/${id}`);
};
