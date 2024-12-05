// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { updateUser } from "../api/auth";
import { getUserById } from "../api/users";
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
} from "../styled/EditProfileStyled";

const EditProfile = () => {
  const { user, token, setUser, login } = useAuth();
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
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    if (!user || !user.id || !token) {
      setError("Bạn cần đăng nhập để xem thông tin cá nhân.");
      setLoading(false);
      return;
    }

    try {
      const response = await getUserById(user.id, token);
      const profileData = response.data;
      setFormData({
        id: profileData.id || "",
        username: profileData.username || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
      });
      setProfile(profileData);
    } catch (err) {
      setError("Không thể tải thông tin người dùng.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setMessage("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const updatedUserResponse = await updateUser(
        user.id,
        { ...formData },
        token
      );
      const updatedUser = updatedUserResponse.data.user;
      login({
        token,
        user: { ...updatedUser, id: user.id, user_role: user.user_role },
      });

      setMessage("Thông tin của bạn đã được cập nhật thành công.");
      navigate("/profile", { state: { updated: true } });
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || "Lỗi máy chủ. Vui lòng thử lại sau.";
      setError(errorMsg);
      console.error("Error during update:", err);
    } finally {
      setLoading(false);
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
