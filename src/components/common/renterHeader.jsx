import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RenterHeader = () => {
  const { user, logout } = useAuth();
  return (
    <header style={headerContainerStyle}>
      {/* Phần trên cùng */}
      <div style={topBarStyle}>
        <div style={logoContainerStyle}>
          <h1 style={logoTextStyle}>Rent-House.com</h1>
          <p style={logoSubTextStyle}>Kênh thông tin phòng trọ số 1 Việt Nam</p>
        </div>
        <div style={topNavStyle}>
          <Link to="/favourite" style={topNavLinkStyle}>
            ❤️ Yêu thích
          </Link>

          {user ? (
            <>
              <span
                style={{ color: "#333", cursor: "pointer" }}
                onClick={logout}
              >
                👤 {user.email} (Đăng xuất)
              </span>
              <Link to="/profile" style={topNavLinkStyle}>
                Hồ sơ
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={topNavLinkStyle}>
                👤 Đăng nhập
              </Link>
              <Link to="/register" style={topNavLinkStyle}>
                📝 Đăng ký
              </Link>
            </>
          )}
          <Link to="/create-post" style={postButtonStyle}>
            ➕ Đăng tin mới
          </Link>
        </div>
      </div>
      {/* Phần điều hướng mới */}
      <nav style={navbarStyle}>
        <ul style={navbarListStyle}>
          <li style={navbarItemStyle}>
            <Link to="/" style={linkStyle}>
              🏠 Trang chủ
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/manage-posts" style={linkStyle}>
              📝 Quản lý bài đăng
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/inforBooking" style={linkStyle}>
              🗓️ Quản lý đặt lịch
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/messages" style={linkStyle}>
              💬 Tin nhắn
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/analytics" style={linkStyle}>
              📊 Thống kê
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

/* CSS bằng inline style */
const headerContainerStyle = {
  backgroundColor: "#fff",
  borderBottom: "2px solid #0056b3",
};

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
};

const logoContainerStyle = {
  display: "flex",
  flexDirection: "column",
};

const logoTextStyle = {
  fontSize: "2em",
  color: "#0056b3",
  margin: 0,
  fontWeight: "bold",
};

const logoSubTextStyle = {
  fontSize: "0.9em",
  margin: 0,
  color: "#666",
};

const topNavStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
};

const topNavLinkStyle = {
  color: "#333",
  textDecoration: "none",
  fontSize: "1em",
};

const postButtonStyle = {
  backgroundColor: "#ff5733",
  color: "white",
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontSize: "1.1em",
  fontWeight: "bold",
};

const navbarStyle = {
  backgroundColor: "#0056b3",
  padding: "10px 0",
};

const navbarListStyle = {
  display: "flex",
  justifyContent: "center",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const navbarItemStyle = {
  display: "inline-block",
  margin: "0 15px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "1.1em",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

export default RenterHeader;
