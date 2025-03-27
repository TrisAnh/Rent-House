"use client";

import { useState, useEffect } from "react";
import { getUserById } from "../api/users";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiEdit2,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";
import {
  ProfileContainer,
  ProfileHeader,
  ProfileContent,
  ProfileCard,
  AvatarContainer,
  Avatar,
  AvatarInitials,
  UserName,
  InfoSection,
  InfoGrid,
  InfoCard,
  InfoIcon,
  InfoContent,
  InfoLabel,
  InfoValue,
  ActionButton,
  MessageContainer,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonLine,
  SkeletonButton,
} from "../styled/ProfileStyled";

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

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
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      fetchProfile();

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleEditProfile = () => {
    navigate("/editProfile", { state: { fromProfile: true } });
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!profile || !profile.username) return "PT";

    const nameParts = profile.username.split(" ");
    if (nameParts.length >= 2) {
      return (
        nameParts[0][0] + nameParts[nameParts.length - 1][0]
      ).toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <ProfileContainer>
        <SkeletonCard>
          <SkeletonAvatar />
          <SkeletonLine width="60%" height="24px" margin="20px auto" />
          <SkeletonLine width="90%" height="16px" margin="10px auto" />
          <SkeletonLine width="90%" height="16px" margin="10px auto" />
          <SkeletonLine width="90%" height="16px" margin="10px auto" />
          <SkeletonLine width="90%" height="16px" margin="10px auto" />
          <SkeletonButton />
        </SkeletonCard>
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <div style={{ textAlign: "center", padding: "30px" }}>
            <h3 style={{ color: "#e63946", marginBottom: "15px" }}>{error}</h3>
            <ActionButton onClick={() => navigate("/login")}>
              Đăng nhập
            </ActionButton>
          </div>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      {showMessage && (
        <MessageContainer>
          <FiCheck size={20} />
          <span>{message}</span>
        </MessageContainer>
      )}

      <ProfileCard>
        <ProfileHeader>
          <AvatarContainer>
            {profile?.username ? (
              <Avatar
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.username
                )}&background=0056b3&color=fff&size=256`}
                alt={`Ảnh đại diện của ${profile.username}`}
              />
            ) : (
              <AvatarInitials>{getUserInitials()}</AvatarInitials>
            )}
          </AvatarContainer>
          <UserName>{profile?.username || "Người dùng"}</UserName>
        </ProfileHeader>

        <ProfileContent>
          <InfoSection>
            <h2>Thông Tin Cá Nhân</h2>
            <InfoGrid>
              <InfoCard>
                <InfoIcon>
                  <FiUser size={20} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Tên người dùng</InfoLabel>
                  <InfoValue>{profile?.username || "Chưa cập nhật"}</InfoValue>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoIcon>
                  <FiMail size={20} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{profile?.email || "Chưa cập nhật"}</InfoValue>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoIcon>
                  <FiPhone size={20} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Số điện thoại</InfoLabel>
                  <InfoValue>{profile?.phone || "Chưa cập nhật"}</InfoValue>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoIcon>
                  <FiMapPin size={20} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Địa chỉ</InfoLabel>
                  <InfoValue>{profile?.address || "Chưa cập nhật"}</InfoValue>
                </InfoContent>
              </InfoCard>
            </InfoGrid>
          </InfoSection>

          <ActionButton onClick={handleEditProfile}>
            <FiEdit2 size={16} style={{ marginRight: "8px" }} />
            Chỉnh Sửa Thông Tin
          </ActionButton>
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;
