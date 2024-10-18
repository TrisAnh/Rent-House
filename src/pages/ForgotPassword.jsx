// src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import { sendOtp, resetPassword } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Title,
  Form,
  Input,
  Button,
  LinkText,
  FooterText,
  Label,
  MessageText,
} from "./ForgotPasswordStyled";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Quản lý bước hiện tại
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(""); // Thông báo thành công
  const [error, setError] = useState(""); // Thông báo lỗi
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sử dụng useEffect để nhận email từ state khi chuyển hướng từ bước 1 sang bước 2
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      setStep(2);
      setMessage("OTP đã được gửi tới email của bạn.");
    }
  }, [location.state]);

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "otp":
        setOtp(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      default:
        break;
    }
    setError("");
    setMessage("");
  };

  // Xử lý gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOtp(email);
      setMessage("OTP đã được gửi tới email của bạn.");
      setStep(2);
    } catch (err) {
      setError("Gửi OTP thất bại. Vui lòng kiểm tra lại email.");
      console.error("Gửi OTP lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setMessage(
        "Mật khẩu đã được đặt lại thành công. Đang chuyển hướng tới đăng nhập..."
      );
      // Chuyển hướng tới trang đăng nhập sau khi đặt lại thành công
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Chờ 3 giây trước khi chuyển hướng
    } catch (err) {
      setError("Đặt lại mật khẩu thất bại. Vui lòng kiểm tra OTP và thử lại.");
      console.error("Đặt lại mật khẩu lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box>
        {step === 1 && (
          <>
            <Title>Quên Mật Khẩu</Title>
            {error && <MessageText type="error">{error}</MessageText>}
            {message && <MessageText type="success">{message}</MessageText>}
            <Form onSubmit={handleSendOtp}>
              <Label htmlFor="email">Email:</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                placeholder="Nhập email của bạn"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Đang gửi OTP..." : "Gửi OTP"}
              </Button>
            </Form>
            <FooterText>
              <LinkText href="/login">Quay lại Đăng Nhập</LinkText>
            </FooterText>
          </>
        )}

        {step === 2 && (
          <>
            <Title>Đặt Lại Mật Khẩu</Title>
            {error && <MessageText type="error">{error}</MessageText>}
            {message && <MessageText type="success">{message}</MessageText>}
            <Form onSubmit={handleResetPassword}>
              <Label htmlFor="email">Email:</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                placeholder="Nhập email của bạn"
                disabled // Không cho phép chỉnh sửa email ở bước 2
              />
              <Label htmlFor="otp">OTP:</Label>
              <Input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleChange}
                required
                placeholder="Nhập OTP đã nhận"
              />
              <Label htmlFor="newPassword">Mật khẩu mới:</Label>
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu mới"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Đang đặt lại..." : "Đặt Lại Mật Khẩu"}
              </Button>
            </Form>
            <FooterText>
              <LinkText href="/login">Quay lại Đăng Nhập</LinkText>
            </FooterText>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPassword;
