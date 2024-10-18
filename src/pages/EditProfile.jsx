// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { updateUser } from "../api/auth"; // Hàm API để cập nhật thông tin người dùng
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Title,
  Form,
  Input,
  Button,
  Label,
  MessageText,
  Card,
  Icon,
} from "./EditProfileStyled"; // Tái sử dụng các styled-components từ ProfileStyled.js

const EditProfile = () => {
  const { user, token, login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setMessage("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang

    setLoading(true); // Hiển thị trạng thái đang tải
    console.log("Submitting form data:", formData); // Log dữ liệu

    try {
      const updatedUser = await updateUser(user.id, { ...formData }, token);
      console.log("Updated user response:", updatedUser); // Log phản hồi từ API

      await login({ token, ...updatedUser.data }); // Cập nhật thông tin người dùng
      console.log("User logged in:", updatedUser.data); // Log thông tin người dùng

      navigate("/profile", { state: { updated: true } }); // Chuyển hướng về trang Profile
    } catch (err) {
      console.error("Error during update:", err); // Log lỗi
      setError("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  };

  return (
    <Container>
      <Card>
        <Title>Chỉnh Sửa Thông Tin Cá Nhân</Title>
        {error && <MessageText type="error">{error}</MessageText>}
        {message && <MessageText type="success">{message}</MessageText>}
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="username">
            <Icon className="fas fa-user" /> Username:
          </Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Nhập username của bạn"
          />
          <Label htmlFor="email">
            <Icon className="fas fa-envelope" /> Email:
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Nhập email của bạn"
          />
          <Label htmlFor="phone">
            <Icon className="fas fa-phone" /> Phone:
          </Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại của bạn"
          />
          <Label htmlFor="address">
            <Icon className="fas fa-home" /> Address:
          </Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ của bạn"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập Nhật Thông Tin"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default EditProfile;
