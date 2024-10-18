// src/components/users/UserProfile.jsx
import React from "react";

const UserProfile = ({ user }) => {
  return (
    <div className="user-profile">
      <h2>Hồ Sơ Người Dùng</h2>
      <p>Tên: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Thêm các thông tin khác */}
    </div>
  );
};

export default UserProfile;
