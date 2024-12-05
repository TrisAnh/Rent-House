import React, { useState, useEffect } from "react";
import { getFavorites, removeFavourite } from "../api/favourites";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useParams, useNavigate, Link } from "react-router-dom";
const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavorites();
        setFavorites(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Danh sách yêu thích trống");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchFavorites();
    }
  }, [user]);

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      await removeFavourite(favoriteId); // Gọi API xóa với favoriteId
      setFavorites(favorites.filter((favorite) => favorite._id !== favoriteId)); // Cập nhật danh sách
      toast.success("Đã xóa khỏi mục yêu thích!");
    } catch (err) {
      console.error("Error deleting favorite:", err);
      toast.error("Không thể xóa mục yêu thích. Vui lòng thử lại!");
    }
  };

  if (loading) {
    return <div style={loadingStyle}>Đang tải...</div>;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Danh Sách Yêu Thích</h1>
      {favorites.length > 0 ? (
        <div style={listStyle}>
          {favorites.map((room) => (
            <div key={room.id} style={cardStyle}>
              <Link
                key={room.id_post._id}
                to={`/listings/${room.id_post._id}`}
                className="flex space-x-4 group"
              >
                <img
                  src={room.id_post.images?.[0]?.url}
                  alt={room.title}
                  style={imageStyle}
                />
              </Link>
              <div style={contentStyle}>
                <h2 style={titleStyle}>{room.id_post.title}</h2>
                <p style={priceStyle}>
                  {room.id_post.price.toLocaleString("vi-VN")} VNĐ/tháng
                </p>
                <p style={infoStyle}>
                  <strong>Chủ trọ:</strong> {room.id_post.landlord.username}
                </p>
                <p style={infoStyle}>
                  <strong>Địa chỉ: </strong>
                  {room.id_post.location.address}, {room.id_post.location.ward},{" "}
                  {room.id_post.location.district}, {room.id_post.location.city}
                </p>
                <button
                  style={deleteButtonStyle}
                  onClick={() => handleDeleteFavorite(room._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={noFavoritesStyle}>Bạn chưa có phòng trọ yêu thích nào.</p>
      )}
    </div>
  );
};

// Inline styles
const deleteButtonStyle = {
  marginTop: "10px",
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: "14px",
};

deleteButtonStyle.hover = {
  backgroundColor: "#c82333",
};

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  fontSize: "28px",
  color: "#333",
  marginBottom: "20px",
  textAlign: "center",
};

const listStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
};

const contentStyle = {
  padding: "15px",
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "10px",
  color: "#0056b3",
};

const priceStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#28a745",
  marginBottom: "10px",
};

const infoStyle = {
  fontSize: "14px",
  marginBottom: "5px",
  color: "#333",
};

const loadingStyle = {
  textAlign: "center",
  fontSize: "18px",
  marginTop: "20px",
};

const errorStyle = {
  color: "#dc3545",
  textAlign: "center",
  fontSize: "18px",
  marginTop: "20px",
};

const noFavoritesStyle = {
  textAlign: "center",
  fontSize: "16px",
  color: "#666",
  marginTop: "20px",
};

export default FavoritesPage;
