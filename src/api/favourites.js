// src/api/favourites.js
import axiosInstance from "./axiosInstance";
export const createFavourite = (id_user_rent, id_post) => {
  return axiosInstance.post("/favorite/create", {
    id_user_rent: id_user_rent,
    id_post: id_post,
  });
};
export const getAllFavorites = () => {
  return axiosInstance.get("/favorite/getAll");
};
export const getFavorites = () => {
  return axiosInstance.get("/favorite/user");
};
export const removeFavourite = (id) => {
  return axiosInstance.delete(`/favorite/delete/${id}`);
};
