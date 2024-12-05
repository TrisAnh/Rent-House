// src/pages/PhoneVerify.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Thay đổi từ useHistory sang useNavigate
import "../assets/styles/PhoneVerification.css";
import { Dialog } from "@mui/material";
import axios from "axios";

const PhoneVerification = () => {
  const { user, logout } = useAuth(); // Lấy thông tin từ context
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState(""); // Khởi tạo state cho số điện thoại là chuỗi rỗng
  const [loading, setLoading] = useState(false); // State cho trạng thái tải
  const [verificationCode, setVerificationCode] = useState(""); // State cho mã xác minh
  const [isVerified, setIsVerified] = useState(false); // State cho việc xác thực thành công
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng
  const [openDialog, setOpenDialog] = useState(false);

  const handleRegisterRenter = async () => {
    try {
      const response = await axios.put(
        `https://be-android-project.onrender.com/api/auth/update-role-to-renter/${user.id}`
      );

      if (response.status === 200) {
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Không thể đăng ký làm người thuê. Vui lòng thử lại sau.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setPhone(user.phone); // Gán số điện thoại từ user
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="phone-verification">
        <p>Vui lòng đăng nhập để đăng bài.</p>
      </div>
    );
  }

  return (
    <div className="phone-verification">
      <div className="breadcrumb">
        <span>Đăng ký cho thuê phòng trọ</span>
      </div>
      <div className="verification-box">
        <p>
          Xin chào <strong>{user.username}</strong>. Hiện bạn đang là người
          dùng. Bạn có chăc chắn muốn đăng ký thành người cho thuê không? Sau
          khi nhấn đăng ký, bạn đã đồng ý với các điều khoản của website chúng
          tôi và sẽ được chuyển hướng đến trang đăng nhập để tiếp tục với tư
          cách người cho thuê
        </p>

        <button
          onClick={handleRegisterRenter}
          className="get-code-button"
          disabled={loading}
        >
          {loading
            ? "Đang gửi yêu cầu..."
            : "Bấm vào đây để đăng ký thành người cho thuê"}
        </button>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <div className="dialog-content">
            <h2>Đăng ký thành công!</h2>
            <p>Vui lòng đăng nhập lại để tiếp tục.</p>
            <button onClick={handleCloseDialog}>OK</button>
          </div>
        </Dialog>

        {message && <p className="success-message">{message}</p>}
      </div>
      <style jsx>{`
        .register-renter-button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
        }
        .dialog-content {
          padding: 20px;
          text-align: center;
        }
        .dialog-content button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default PhoneVerification;
