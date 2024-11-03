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
} from "../styled/ProfileStyled";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async () => {
    if (!user || !user.id || !token) {
      setError("Bạn cần đăng nhập để xem thông tin cá nhân.");
      setLoading(false);
      return;
    }

    try {
      const response = await getUserById(user.id, token);
      setProfile(response.data);
    } catch (err) {
      handleFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchError = (err) => {
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
  };

  useEffect(() => {
    fetchProfile();
  }, [user, token]);

  useEffect(() => {
    if (location.state && location.state.updated) {
      setError("Thông tin cá nhân đã được cập nhật thành công.");
      fetchProfile();
    }
  }, [location.state]);

  const handleEditProfile = () => {
    navigate("/editProfile", { state: { fromProfile: true } });
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
        {profile && renderProfileInfo(profile)}
        {profile && (
          <Button onClick={handleEditProfile}>Chỉnh Sửa Thông Tin</Button>
        )}
      </Box>
    </Container>
  );
};

const renderProfileInfo = (profile) => (
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
);

export default Profile;
