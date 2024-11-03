// src/pages/PhoneVerify.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Thay đổi từ useHistory sang useNavigate
import "../assets/styles/PhoneVerification.css";

const PhoneVerification = () => {
  const { user, logout } = useAuth(); // Lấy thông tin từ context
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState(""); // Khởi tạo state cho số điện thoại là chuỗi rỗng
  const [loading, setLoading] = useState(false); // State cho trạng thái tải
  const [verificationCode, setVerificationCode] = useState(""); // State cho mã xác minh
  const [isVerified, setIsVerified] = useState(false); // State cho việc xác thực thành công
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng

  // Sử dụng useEffect để thiết lập số điện thoại khi người dùng được xác thực
  useEffect(() => {
    if (user) {
      setPhone(user.phone); // Gán số điện thoại từ user
    }
  }, [user]);

  const handleGetCode = async () => {
    setLoading(true);
    setMessage("");

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^\d{10,15}$/; // Định dạng số điện thoại (10-15 chữ số)
    if (!phoneRegex.test(phone)) {
      setMessage("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      // Logic để gửi mã xác thực qua SMS
      // Giả sử bạn có một API gửi mã xác minh
      // await sendVerificationCode(phone); // Bạn cần định nghĩa hàm này
      setMessage("Mã xác minh đã được gửi qua SMS!");
    } catch (error) {
      setMessage("Có lỗi xảy ra khi gửi mã xác minh. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      // Giả sử bạn đã định nghĩa hàm verifyCode để xác thực mã
      //  await verifyCode(verificationCode); // Xác thực mã

      // Nếu xác thực thành công, cập nhật vai trò thành "rent"
      // await updateRole(user.id, "renter");

      setMessage("Xác thực thành công!");

      // Chuyển hướng đến trang đăng bài viết
      navigate("/create-post");
    } catch (error) {
      setMessage("Mã xác minh không chính xác.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="phone-verification">
        <p>Vui lòng đăng nhập để xác thực số điện thoại.</p>
      </div>
    );
  }

  return (
    <div className="phone-verification">
      <div className="breadcrumb">
        <span>Xác thực số điện thoại</span>
      </div>
      <div className="verification-box">
        <p>
          Xin chào <strong>{user.username}</strong>. Bạn cần xác thực số điện
          thoại trước khi tiếp tục. Nhập số điện thoại của bạn vào ô bên dưới,
          chúng tôi sẽ gửi mã xác minh qua tin nhắn SMS.
        </p>
        <label>Số điện thoại di động của bạn:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)} // Allow editing
          className="phone-input"
        />
        <button
          onClick={handleGetCode}
          className="get-code-button"
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Bấm vào đây để lấy mã (Miễn phí)"}
        </button>

        {/* Thêm phần nhập mã xác minh */}
        <label>Mã xác minh:</label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)} // Allow editing
          className="code-input"
        />
        <button
          onClick={handleVerifyCode}
          className="verify-code-button"
          disabled={!verificationCode}
        >
          Xác minh mã
        </button>

        {message && <p className="success-message">{message}</p>}
        <p className="support">
          Bạn gặp khó khăn trong quá trình xác thực tài khoản? Vui lòng gọi{" "}
          <span className="support-number">0917 686 101</span> để chúng tôi hỗ
          trợ bạn.
        </p>
        <button onClick={handleLogout} className="logout-button">
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default PhoneVerification;
