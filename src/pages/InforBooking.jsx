import React, { useEffect, useState } from "react";
import { getRequest } from "../api/request";
import { useAuth } from "../hooks/useAuth";
import { getUserById } from "../api/users";
import { getPostById } from "../api/post";
import { Link } from "react-router-dom";
const BookingDetails = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await getRequest(user.id);
        const bookingsWithDetails = await Promise.all(
          response.data.map(async (booking) => {
            try {
              const userRent = await getUserById(booking.id_user_rent);
              const post = await getPostById(booking.id_post);
              console.log("Dữ liệu người đặt phòng:", userRent);
              console.log("Dữ liệu bài đăng:", post);
              return {
                ...booking,
                userRentName: userRent?.data.username || "N/A",
                postTitle: post?.data.title || "N/A",
                postId: post?.data._id, // Lưu lại postId để điều hướng
              };
            } catch (error) {
              console.error("Error fetching booking details:", error);
              return { ...booking, userRentName: "Error", postTitle: "Error" };
            }
          })
        );
        setBookingData(bookingsWithDetails);
      } catch (err) {
        setError("Không thể tải thông tin đặt lịch.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchBookingDetails();
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
      <h2 style={headerStyle}>Thông Tin Lịch Đặt Phòng</h2>
      {bookingData.length > 0 ? (
        <div style={bookingListStyle}>
          {bookingData.map((booking) => (
            <div key={booking._id} style={bookingCardStyle}>
              <div style={bookingHeaderStyle}>
                <Link
                  to={`/listings/${booking.postId}`}
                  style={bookingTitleStyle}
                >
                  {booking.postTitle}
                </Link>
              </div>
              <div style={bookingContentStyle}>
                <p style={bookingInfoStyle}>
                  <strong>Người Đặt:</strong> {booking.userRentName}
                </p>
                <p style={bookingInfoStyle}>
                  <strong>Ngày Đặt:</strong>{" "}
                  {new Date(booking.date_time).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p style={bookingInfoStyle}>
                  <strong>Giờ Đặt:</strong>{" "}
                  {new Date(booking.date_time).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={noBookingsStyle}>Không có thông tin lịch đặt phòng.</p>
      )}
    </div>
  );
};

// Inline styles
const containerStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  fontSize: "24px",
  color: "#333",
  marginBottom: "20px",
  textAlign: "center",
};

const bookingListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const bookingCardStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const bookingHeaderStyle = {
  backgroundColor: "#0056b3",
  color: "#fff",
  padding: "15px",
};

const bookingTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
};

const bookingContentStyle = {
  padding: "15px",
};

const bookingInfoStyle = {
  margin: "10px 0",
  fontSize: "16px",
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

const noBookingsStyle = {
  textAlign: "center",
  fontSize: "16px",
  color: "#666",
  marginTop: "20px",
};

export default BookingDetails;
