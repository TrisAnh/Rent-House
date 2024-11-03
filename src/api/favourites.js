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
