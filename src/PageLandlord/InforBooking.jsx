import React, { useEffect, useState } from "react";
import {
  getRequest,
  updateAcceptRequest,
  updateDeclineRequest,
  updateDeleteRequest,
} from "../api/request";
import { useAuth } from "../hooks/useAuth";
import { getUserById } from "../api/users";
import { getPostById } from "../api/post";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, Home, Check, X } from "lucide-react";
import { toast } from "react-toastify";

const BookingDetails = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await getRequest(user.id);
        console.log("Booking response:", response); // Add logging
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
  const handleAccept = async (bookingId) => {
    try {
      await updateAcceptRequest(bookingId);
      setBookingData((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Accepted" }
            : booking
        )
      );
      toast.success("Chấp nhận yêu cầu thành công!"); // Thông báo thành công
    } catch (error) {
      toast.error("Không thể chấp nhận yêu cầu.");
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa yêu cầu này không?")) {
      try {
        await updateDeleteRequest(bookingId);
        setBookingData((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
        toast.success("Yêu cầu đã được xóa thành công.");
      } catch (error) {
        toast.error("Không thể xóa yêu cầu.");
      }
    }
  };

  const handleReject = async (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn từ chối yêu cầu này không?")) {
      try {
        await updateDeclineRequest(bookingId);
        setBookingData((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "Declined" }
              : booking
          )
        );
        toast.success("Yêu cầu đã bị từ chối.");
      } catch (error) {
        toast.error("Không thể từ chối yêu cầu.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h2 className="header">Thông Tin Lịch Đặt Phòng</h2>

      {bookingData.length > 0 ? (
        <div className="booking-list">
          {bookingData.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <Link
                  to={`/listings/${booking.postId}`}
                  className="booking-title"
                >
                  <Home className="icon" />
                  {booking.postTitle}
                </Link>
              </div>
              <div className="booking-content">
                <p className="booking-info">
                  <User className="icon" />
                  <strong>Người Đặt:</strong> {booking.userRentName}
                </p>
                <p className="booking-info">
                  <Calendar className="icon" />
                  <strong>Ngày Đặt:</strong>{" "}
                  {new Date(booking.date_time).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="booking-info">
                  <Clock className="icon" />
                  <strong>Giờ Đặt:</strong>{" "}
                  {new Date(booking.date_time).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="booking-actions">
                {booking.status !== "Accepted" &&
                  booking.status !== "Declined" && (
                    <>
                      <button
                        onClick={() => handleAccept(booking._id)}
                        className="btn btn-accept"
                        disabled={
                          booking.status === "Accepted" ||
                          booking.status === "Declined"
                        }
                      >
                        <Check className="icon" />
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handleReject(booking._id)}
                        className="btn btn-reject"
                        disabled={
                          booking.status === "Accepted" ||
                          booking.status === "Declined"
                        }
                      >
                        <X className="icon" />
                        Từ chối
                      </button>
                    </>
                  )}

                {(booking.status === "Accepted" ||
                  booking.status === "Declined") && (
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="btn btn-delete"
                  >
                    <X className="icon" />
                    Xoá
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-bookings">Không có thông tin lịch đặt phòng.</p>
      )}

      <style>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
  
        .header {
          font-size: 28px;
          color: #333;
          margin-bottom: 30px;
          text-align: center;
          font-weight: bold;
        }
  
        .booking-list {
          display: grid;
          gap: 20px;
        }
  
        .booking-card {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
        }
  
        .booking-card:hover {
          transform: translateY(-5px);
        }
  
        .booking-header {
          background-color: #3498db;
          color: #fff;
          padding: 15px 20px;
        }
  
        .booking-title {
          font-size: 20px;
          font-weight: bold;
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
        }
  
        .booking-content {
          padding: 20px;
        }
  
        .booking-info {
          margin: 10px 0;
          font-size: 16px;
          display: flex;
          align-items: center;
        }
  
        .icon {
          margin-right: 10px;
          width: 20px;
          height: 20px;
        }
  
        .booking-actions {
          display: flex;
          justify-content: flex-end;
          padding: 0 20px 20px;
          gap: 10px;
        }
  
        .btn {
          padding: 10px 20px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.3s ease;
        }
  
        .btn-accept {
          background-color: #2ecc71;
          color: #fff;
        }
  
        .btn-accept:hover {
          background-color: #27ae60;
        }
  
        .btn-reject {
          background-color: #e74c3c;
          color: #fff;
        }
  
        .btn-reject:hover {
          background-color: #c0392b;
        }
  
        .btn-delete {
          background-color: #e67e22;
          color: #fff;
        }
  
        .btn-delete:hover {
          background-color: #d35400;
        }
  
        .loading,
        .error,
        .no-bookings {
          text-align: center;
          font-size: 18px;
          margin-top: 20px;
          color: #666;
        }
  
        .error {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
};
export default BookingDetails;
