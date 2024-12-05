import React, { useEffect, useState } from "react";
import {
  getRequestByUserId,
  updateAcceptRequest,
  updateDeclineRequest,
  updateDeleteRequest,
  updateRequest,
} from "../api/request";
import { useAuth } from "../hooks/useAuth";
import { getUserById } from "../api/users";
import { getPostById } from "../api/post";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, Home, Check, X } from "lucide-react";
import { toast } from "react-toastify";

const BookingDetailsUser = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [newDateTime, setNewDateTime] = useState("");
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await getRequestByUserId(user.id);
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
  {
    /*} const handleAccept = async (bookingId) => {
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
  };*/
  }
  const handleScheduleViewing = (id) => {
    // Placeholder function for scheduling viewing
    console.log("Đặt lịch xem cho bài đăng có ID:", id);
    // Implement your scheduling logic here
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

  {
    /*} const handleReject = async (bookingId) => {
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
  };*/
  }
  const handleUpdate = async (bookingId, currentDateTime) => {
    setIsUpdating(true);
    setUpdatingBookingId(bookingId);
    setNewDateTime(currentDateTime);
  };

  const submitUpdate = async () => {
    if (newDateTime && newDateTime !== updatingBookingId) {
      try {
        await updateRequest(updatingBookingId, { date_time: newDateTime });
        setBookingData((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === updatingBookingId
              ? { ...booking, date_time: newDateTime }
              : booking
          )
        );
        toast.success("Yêu cầu đã được cập nhật thành công.");
      } catch (error) {
        toast.error("Không thể cập nhật yêu cầu.");
      }
    }
    setIsUpdating(false);
    setUpdatingBookingId(null);
    setNewDateTime("");
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
                {/* <p className="booking-info">
                  <User className="icon" />
                  <strong>Người Đặt:</strong> {booking.userRentName}
                </p>*/}
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
                        onClick={() => handleUpdate(booking._id)}
                        className="btn btn-accept"
                        disabled={
                          booking.status === "Accepted" ||
                          booking.status === "Declined"
                        }
                      >
                        <Check className="icon" />
                        Cập nhật
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="btn btn-reject"
                        disabled={
                          booking.status === "Accepted" ||
                          booking.status === "Declined"
                        }
                      >
                        <X className="icon" />
                        Xoá
                      </button>
                    </>
                  )}

                {/*} {(booking.status === "Accepted" ||
                  booking.status === "Declined") && (
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="btn btn-delete"
                  >
                    <X className="icon" />
                    Xoá
                  </button>
                )}*/}
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
      <style jsx>{`
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

        .icon-home,
        .icon-calendar,
        .icon-clock,
        .icon-check,
        .icon-x {
          margin-right: 10px;
          width: 20px;
          height: 20px;
          display: inline-block;
          background-size: contain;
          background-repeat: no-repeat;
        }

        .icon-home {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>');
        }
        .icon-calendar {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>');
        }
        .icon-clock {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>');
        }
        .icon-check {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>');
        }
        .icon-x {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>');
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
      `}</style>
    </div>
  );
};
export default BookingDetailsUser;
