import React, { useState, useEffect } from "react";
import { getUserById } from "../api/users";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  ProfileContainer,
  ProfileCard,
  Avatar,
  Title,
  InfoList,
  InfoItem,
  Label,
  Value,
  EditButton,
  MessageText,
  SkeletonLoader,
} from "../styled/ProfileStyled";

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");

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
  }, []);

  useEffect(() => {
    if (location.state && location.state.updated) {
      setMessage("Thông tin cá nhân đã được cập nhật thành công.");
      fetchProfile();
    }
  }, [location.state]);

  const handleEditProfile = () => {
    navigate("/editProfile", { state: { fromProfile: true } });
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        {message && <MessageText type="success">{message}</MessageText>}
        {profile && (
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.username
            )}&background=random`}
            alt={`Ảnh đại diện của ${profile.username}`}
          />
        )}
        <Title>Thông Tin Cá Nhân</Title>
        {error && <MessageText type="error">{error}</MessageText>}
        {profile && (
          <>
            <InfoList>
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
            </InfoList>
            <EditButton onClick={handleEditProfile}>
              Chỉnh Sửa Thông Tin
            </EditButton>
          </>
        )}
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;
