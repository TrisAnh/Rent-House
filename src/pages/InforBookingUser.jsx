import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Home, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import {
  getRequestByUserId,
  updateRequest,
  updateDeleteRequest,
} from "../api/request";
import { getUserById } from "../api/users";
import { getPostById } from "../api/post";

const BookingDetailsUser = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [newDateTime, setNewDateTime] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!user || !user.id) return;

      try {
        const response = await getRequestByUserId(user.id);
        const bookingsWithDetails = await Promise.all(
          response.data.map(async (booking) => {
            try {
              const userRent = await getUserById(booking.id_user_rent);
              const post = await getPostById(booking.id_post);
              return {
                ...booking,
                userRentName: userRent?.data.username || "N/A",
                postTitle: post?.data.title || "N/A",
                postId: post?.data._id,
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

    fetchBookingDetails();
  }, [user]);

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

  const handleUpdate = (bookingId, currentDateTime) => {
    setIsUpdating(true);
    setUpdatingBookingId(bookingId);
    // Convert UTC to local time for the input
    const localDateTime = new Date(currentDateTime)
      .toLocaleString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(" ", "T");
    setNewDateTime(localDateTime);
  };

  const submitUpdate = async () => {
    if (!newDateTime || !updatingBookingId) {
      toast.error("Vui lòng chọn thời gian mới.");
      return;
    }

    try {
      // Convert local time to UTC before sending to the server
      const utcDateTime = new Date(newDateTime).toISOString();

      const response = await updateRequest(updatingBookingId, {
        date_time: utcDateTime,
      });

      if (response.status === 200) {
        setBookingData((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === updatingBookingId
              ? { ...booking, date_time: utcDateTime }
              : booking
          )
        );
        toast.success("Yêu cầu đã được cập nhật thành công.");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Không thể cập nhật yêu cầu.");
    } finally {
      setIsUpdating(false);
      setUpdatingBookingId(null);
      setNewDateTime("");
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

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
                  <Calendar className="icon" />
                  <strong>Ngày và Giờ Đặt:</strong>{" "}
                  {new Date(booking.date_time).toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
                <p className="booking-info">
                  <strong>Trạng thái:</strong>{" "}
                  <span className={`status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </p>
              </div>
              <div className="booking-actions">
                {booking.status === "Pending" && (
                  <button
                    onClick={() => handleUpdate(booking._id, booking.date_time)}
                    className="btn btn-accept"
                  >
                    <Check className="icon" />
                    Cập nhật
                  </button>
                )}
                {(booking.status === "Accepted" ||
                  booking.status === "Declined") && (
                  <p className="status-message">
                    {booking.status === "Accepted"
                      ? "Đã được chấp nhận. Không thể chỉnh sửa."
                      : "Đã bị từ chối. Không thể chỉnh sửa."}
                  </p>
                )}
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="btn btn-reject"
                >
                  <X className="icon" />
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-bookings">Không có thông tin lịch đặt phòng.</p>
      )}
      {isUpdating && (
        <div className="update-form-overlay">
          <div className="update-form">
            <h3>Cập nhật lịch hẹn</h3>
            <input
              type="datetime-local"
              value={newDateTime}
              onChange={(e) => setNewDateTime(e.target.value)}
              className="datetime-input"
            />
            <div className="update-form-actions">
              <button onClick={submitUpdate} className="btn btn-accept">
                Xác nhận
              </button>
              <button
                onClick={() => {
                  setIsUpdating(false);
                  setUpdatingBookingId(null);
                  setNewDateTime("");
                }}
                className="btn btn-reject"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
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
        }

        .status {
          font-weight: bold;
          padding: 5px 10px;
          border-radius: 4px;
        }

        .status.pending {
          background-color: #f39c12;
          color: #fff;
        }

        .status.accepted {
          background-color: #2ecc71;
          color: #fff;
        }

        .status.declined {
          background-color: #e74c3c;
          color: #fff;
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

        .update-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .update-form {
          background-color: #fff;
          padding: 20px;
          border-radius: 12px;
          width: 300px;
        }

        .update-form h3 {
          margin-bottom: 15px;
          text-align: center;
        }

        .datetime-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .update-form-actions {
          display: flex;
          justify-content: space-between;
        }

        .status-message {
          font-style: italic;
          color: #666;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default BookingDetailsUser;
