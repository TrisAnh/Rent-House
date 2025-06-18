"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  createRequest,
  getRequestByUserId,
  updateDeleteRequest,
} from "../api/request";
import { getPostById } from "../api/post";
import { toast } from "react-toastify";

const RoomBookingForm = ({ onClose }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const { id } = useParams();
  const [landlord, setLandlord] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const [existingBooking, setExistingBooking] = useState(null);
  const [checkingBooking, setCheckingBooking] = useState(true);

  const formatDate = (dateTime) => {
    if (!dateTime) return "Chưa xác định";

    const date = new Date(dateTime);

    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh", // Chỉ định rõ timezone
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Sửa function formatTime
  const formatTime = (dateTime) => {
    if (!dateTime) return "Chưa xác định";

    const date = new Date(dateTime);

    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh", // Chỉ định rõ timezone
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Sử dụng format 24h
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "cho_xac_nhan":
        return "#f59e0b";
      case "approved":
      case "da_xac_nhan":
        return "#10b981";
      case "rejected":
      case "da_tu_choi":
        return "#ef4444";
      case "completed":
      case "hoan_thanh":
        return "#6366f1";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "cho_xac_nhan":
        return "Chờ xác nhận";
      case "approved":
      case "da_xac_nhan":
        return "Đã xác nhận";
      case "rejected":
      case "da_tu_choi":
        return "Đã từ chối";
      case "completed":
      case "hoan_thanh":
        return "Đã hoàn thành";
      default:
        return "Không xác định";
    }
  };

  // Function kiểm tra booking đã tồn tại
  const checkExistingBooking = async () => {
    if (!user || !id) {
      setCheckingBooking(false);
      return;
    }

    try {
      setCheckingBooking(true);

      console.log("=== CHECKING EXISTING BOOKING ===");
      console.log("User ID:", user.id);
      console.log("Post ID:", id, "Type:", typeof id);

      const response = await getRequestByUserId(user.id);

      console.log("User requests response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        // Tìm request cho post hiện tại
        const existingRequest = response.data.find((request) => {
          return (
            request.id_post === id ||
            request.id_post === Number.parseInt(id) ||
            String(request.id_post) === String(id)
          );
        });

        console.log("Found existing request:", existingRequest);

        if (existingRequest) {
          setHasExistingBooking(true);
          setExistingBooking(existingRequest);
          console.log("✅ User has existing booking");
        } else {
          setHasExistingBooking(false);
          setExistingBooking(null);
          console.log("❌ No existing booking found");
        }
      } else {
        setHasExistingBooking(false);
        setExistingBooking(null);
      }
    } catch (error) {
      console.error("Error checking existing booking:", error);
      setHasExistingBooking(false);
      setExistingBooking(null);
    } finally {
      setCheckingBooking(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch post details
        const response = await getPostById(id);
        setPostDetails(response.data);
        setLandlord(response.data.landlord);

        // Kiểm tra booking nếu user đã login
        if (user) {
          await checkExistingBooking();
        } else {
          setCheckingBooking(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải thông tin bài đăng.");
        setCheckingBooking(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, user]);

  // Function hủy booking
  const handleCancelBooking = async () => {
    // Loại bỏ window.confirm
    // if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này không?")) {
    //   return;
    // }

    try {
      const requestId = existingBooking._id || existingBooking.id;
      await updateDeleteRequest(requestId);

      console.log("Cancelling booking:", existingBooking.id);

      // Reset state
      setHasExistingBooking(false);
      setExistingBooking(null);

      toast.success("Đã hủy lịch hẹn thành công! Bạn có thể đặt lịch mới.");
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error("Có lỗi khi hủy lịch hẹn. Vui lòng thử lại.");
    }
  };

  // THÊM HÀM VALIDATE DATE
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const minDate = new Date();

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      toast.warn("Vui lòng chọn ngày và giờ"); // Thay alert bằng toast.warn
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.warn("Không thể đặt lịch cho ngày trong quá khứ!"); // Thay alert bằng toast.warn
      return;
    }

    // FIX: Tạo datetime đúng timezone Việt Nam
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Tạo ISO string với timezone Việt Nam (+07:00)
    const isoString = `${year}-${month}-${day}T${time}:00+07:00`;

    console.log("Sending datetime:", isoString); // Debug log

    const requestData = {
      id_user_rent: user.id,
      id_renter: landlord,
      id_post: id,
      date_time: isoString, // Gửi với timezone rõ ràng
    };

    try {
      const response = await createRequest(requestData);
      toast.success("Đặt lịch thành công!"); // Thay alert bằng toast.success
      onClose();
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Đặt lịch không thành công. Vui lòng thử lại."); // Thay alert bằng toast.error
    }
  };

  // Styles
  const containerStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    zIndex: 1000,
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const headerStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
    textAlign: "center",
    color: "#1f2937",
  };

  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "120px",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    cursor: "pointer",
    fontSize: "16px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Loading state
  if (loading || checkingBooking) {
    return (
      <div style={containerStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          ✕
        </button>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>⏳</div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={containerStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          ✕
        </button>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>❌</div>
          <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
      </div>
    );
  }

  // Existing booking state
  if (hasExistingBooking && existingBooking) {
    return (
      <div style={containerStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          ✕
        </button>

        <h2 style={headerStyle}>{postDetails?.title || "Phòng trọ"}</h2>

        {/* Thông báo đã đặt lịch */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
          <h3
            style={{ color: "#92400e", marginBottom: "12px", fontSize: "18px" }}
          >
            Bạn đã đặt lịch xem phòng này rồi!
          </h3>
          <div
            style={{
              color: "#78350f",
              fontSize: "14px",
              lineHeight: "1.6",
              textAlign: "left",
            }}
          >
            <p>
              <strong>Mã yêu cầu:</strong> #
              {existingBooking._id || existingBooking.id}
            </p>
            <p>
              <strong>Ngày hẹn:</strong> {formatDate(existingBooking.date_time)}
            </p>
            <p>
              <strong>Giờ hẹn:</strong> {formatTime(existingBooking.date_time)}
            </p>
            <p style={{ display: "flex", alignItems: "center" }}>
              <strong>Trạng thái:</strong>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: getStatusColor(existingBooking.status),
                  color: "white",
                  marginLeft: "8px",
                  fontSize: "12px",
                }}
              >
                {getStatusText(existingBooking.status)}
              </span>
            </p>
            {existingBooking.notes && (
              <p>
                <strong>Ghi chú:</strong> {existingBooking.notes}
              </p>
            )}
          </div>
        </div>

        {/* Lưu ý */}
        <div
          style={{
            backgroundColor: "#e0f2fe",
            border: "1px solid #0284c7",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <h4
            style={{ color: "#0c4a6e", marginBottom: "8px", fontSize: "14px" }}
          >
            💡 Lưu ý:
          </h4>
          <ul
            style={{
              color: "#075985",
              fontSize: "13px",
              lineHeight: "1.4",
              margin: 0,
              paddingLeft: "16px",
            }}
          >
            <li>Chỉ được phép đặt 1 lịch cho mỗi phòng trọ</li>
            <li>
              Nếu muốn thay đổi lịch hẹn, vui lòng hủy lịch cũ trước hoặc cập
              nhật lịch đặt
            </li>
            <li>Liên hệ chủ trọ nếu cần hỗ trợ</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={handleCancelBooking}
            style={{
              ...buttonStyle,
              backgroundColor: "#dc2626",
              color: "white",
            }}
          >
            Hủy lịch hẹn
          </button>
          <button
            onClick={onClose}
            style={{
              ...buttonStyle,
              backgroundColor: "#6b7280",
              color: "white",
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // Normal booking form
  return (
    <div style={containerStyle}>
      <button onClick={onClose} style={closeButtonStyle}>
        ✕
      </button>

      <h2 style={headerStyle}>{postDetails?.title || "Đặt lịch xem phòng"}</h2>
      <p
        style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Chọn ngày và giờ để đặt lịch
      </p>

      <div style={{ marginBottom: "20px" }}>
        <img
          src={postDetails?.images?.[0]?.url || "/placeholder.svg"}
          alt="Hình ảnh phòng"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
          color: "#1f2937",
        }}
      >
        {postDetails?.price
          ? `${postDetails.price.toLocaleString()} VND`
          : "Liên hệ"}
      </div>

      <form
        onSubmit={handleBooking}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Chọn ngày (từ hôm nay)"
          customInput={
            <input
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
          }
          minDate={minDate}
          filterDate={(date) => !isDateDisabled(date)}
        />

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          <option value="">Chọn giờ</option>
          <option value="08:00">08:00 - Sáng</option>
          <option value="08:30">08:30 - Sáng</option>
          <option value="09:00">09:00 - Sáng</option>
          <option value="09:30">09:30 - Sáng</option>
          <option value="10:00">10:00 - Sáng</option>
          <option value="10:30">10:30 - Sáng</option>
          <option value="11:00">11:00 - Sáng</option>
          <option value="11:30">11:30 - Sáng</option>
          <option value="13:00">13:00 - Chiều</option>
          <option value="13:30">13:30 - Chiều</option>
          <option value="14:00">14:00 - Chiều</option>
          <option value="14:30">14:30 - Chiều</option>
          <option value="15:00">15:00 - Chiều</option>
          <option value="15:30">15:30 - Chiều</option>
          <option value="16:00">16:00 - Chiều</option>
          <option value="16:30">16:30 - Chiều</option>
          <option value="17:00">17:00 - Chiều</option>
          <option value="17:30">17:30 - Chiều</option>
          <option value="18:00">18:00 - Tối</option>
          <option value="18:30">18:30 - Tối</option>
          <option value="19:00">19:00 - Tối</option>
          <option value="19:30">19:30 - Tối</option>
          <option value="20:00">20:00 - Tối</option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1f2937",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Đặt Lịch
        </button>
      </form>
    </div>
  );
};

export default RoomBookingForm;
