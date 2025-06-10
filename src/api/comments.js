import axiosInstance from "./axiosInstance";
export const getCommentByPostId = (postId) => {
  return axiosInstance.get(`/comment/post/${postId}`);
};

export const createComment = (data) => {
  return axiosInstance.post("comment/create", data);
};
export const updateComment = (id, data) => {
  return axiosInstance.put(`comment/${id}`, data);
};
export const deleteComment = (id) => {
  return axiosInstance.delete(`comment/delete/${id}`);
};
