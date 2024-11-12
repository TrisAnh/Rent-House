import React, { useState, useEffect } from "react";
import { getFavorites } from "../api/favourites";
import { useAuth } from "../hooks/useAuth";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();
  console.log("User:", user);
  console.log("Token:", token);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavorites();
        console.log("API Response:", response);
        setFavorites(response.data);
        console.log("Danh sách yêu thích:", response.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Không thể tải danh sách yêu thích.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchFavorites();
    }
  }, [user]);

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
              <img src={room.image} alt={room.title} style={imageStyle} />
              <div style={contentStyle}>
                <h2 style={titleStyle}>{room.id_post}</h2>
                <p style={priceStyle}>
                  {room.price.toLocaleString("vi-VN")} VNĐ/tháng
                </p>
                <p style={infoStyle}>
                  <strong>Chủ trọ:</strong> {room.id_user_rent}
                </p>
                <p style={infoStyle}>
                  <strong>Địa chỉ:</strong> {room.location}
                </p>
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
