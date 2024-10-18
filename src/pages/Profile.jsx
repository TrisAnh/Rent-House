// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { getUserById } from "../api/users";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Title,
  InfoContainer,
  InfoItem,
  Label,
  Value,
  Button,
  MessageText,
} from "./ProfileStyled";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async () => {
    if (!user || !token) {
      setError("Bạn cần đăng nhập để xem thông tin cá nhân.");
      setLoading(false);
      return;
    }

    try {
      const response = await getUserById(user.id, token);
      setProfile(response.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError("Không tìm thấy người dùng.");
        } else if (err.response.status === 500) {
          setError("Lỗi máy chủ. Vui lòng thử lại sau.");
        } else {
          setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      } else {
        setError("Không thể kết nối đến server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(); // Gọi ngay khi component được mount
  }, [user, token]);

  // Kiểm tra nếu trang chuyển hướng từ trang chỉnh sửa thành công
  useEffect(() => {
    if (location.state && location.state.updated) {
      setError("Thông tin cá nhân đã được cập nhật thành công.");
      fetchProfile(); // Gọi lại hàm này để cập nhật thông tin
    }
  }, [location.state]);

  const handleEditProfile = () => {
    navigate("/editProfile");
  };

  if (loading) {
    return (
      <Container>
        <Box>
          <Title>Thông Tin Cá Nhân</Title>
          <p style={{ textAlign: "center" }}>Đang tải...</p>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box>
        <Title>Thông Tin Cá Nhân</Title>
        {error && <MessageText type="error">{error}</MessageText>}
        {profile && (
          <InfoContainer>
            <InfoItem>
              <Label>Username:</Label>
              <Value>{profile.username}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Email:</Label>
              <Value>{profile.email}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Phone:</Label>
              <Value>{profile.phone}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Address:</Label>
              <Value>{profile.address}</Value>
            </InfoItem>
          </InfoContainer>
        )}
        {profile && (
          <Button onClick={handleEditProfile}>Chỉnh Sửa Thông Tin</Button>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
