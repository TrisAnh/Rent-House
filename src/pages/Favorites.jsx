// FavoritesPage.jsx
import React, { useEffect, useState } from "react";
import { getAllFavorites } from "../api/favourites";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getAllFavorites();
        setFavorites(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách yêu thích:", err);
        setError("Không thể tải danh sách yêu thích!");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Danh sách Mục Yêu Thích</h1>
      <ul>
        {favorites.map((favorite, index) => (
          <li key={index}>
            {/* Giả sử bạn muốn hiển thị các thuộc tính của bài đăng mà người dùng yêu thích */}
            <p>ID Người Thuê: {favorite.id_user_rent}</p>
            <p>ID Bài Đăng: {favorite.id_post}</p>
            {/* Nếu bạn muốn render thêm thông tin từ bài đăng, bạn cần lấy thêm dữ liệu từ API */}
            {/* Ví dụ: */}
            {/* <p>Title: {favorite.post.title}</p>
            <p>Description: {favorite.post.description}</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
