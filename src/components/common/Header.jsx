import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MdNotifications } from "react-icons/md";
import { getNotification } from "../../api/notifications";
const Header = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Fetch notifications using the getNotification function
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(); // API call to fetch notifications
        console.log("Dữ liệu thông báo:", response.data);
        setNotifications(response.data); // Store the notifications in the state
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (user) {
      fetchNotifications(); // Only fetch notifications if the user is logged in
    }
  }, [user]); // Depend on user to fetch notifications when the user changes

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header style={headerContainerStyle}>
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
          <Link to="/phone" style={postButtonStyle}>
            ➕ Đăng tin miễn phí
          </Link>

          <div style={notificationIconContainer} ref={notificationRef}>
            <button
              onClick={toggleNotifications}
              style={notificationButtonStyle}
              aria-label="Thông báo"
            >
              <MdNotifications size={24} color="#333" />
            </button>
            {showNotifications && (
              <div style={notificationDropdownStyle}>
                <h3 style={notificationHeaderStyle}>Thông báo</h3>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification._id} style={notificationItemStyle}>
                      <p style={notificationUserStyle}>
                        {notification.id_user.username}
                      </p>
                      <p style={notificationMessageStyle}>
                        {notification.message}
                      </p>
                      <p style={notificationDateStyle}>
                        {new Date(notification.create_at).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={noNotificationStyle}>Không có thông báo mới</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <nav style={navbarStyle}>
        <ul style={navbarListStyle}>
          <li style={navbarItemStyle}>
            <Link to="/" style={linkStyle}>
              Trang chủ
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/listings" style={linkStyle}>
              Cho thuê phòng trọ
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/rent-house" style={linkStyle}>
              Nhà cho thuê
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/rent-apartment" style={linkStyle}>
              Cho thuê căn hộ
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/rent-space" style={linkStyle}>
              Cho thuê Mặt bằng
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/find-roommates" style={linkStyle}>
              Tìm người ở ghép
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/news" style={linkStyle}>
              Tin tức
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/pricing" style={linkStyle}>
              Bảng giá dịch vụ
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

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

const notificationIconContainer = {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const notificationButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "5px",
};

const notificationDropdownStyle = {
  position: "absolute",
  top: "100%",
  right: 0,
  backgroundColor: "white",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  width: "300px",
  maxHeight: "400px",
  overflowY: "auto",
  zIndex: 1000,
};

const notificationHeaderStyle = {
  padding: "10px 15px",
  margin: 0,
  borderBottom: "1px solid #eee",
  fontWeight: "bold",
};

const notificationItemStyle = {
  padding: "10px 15px",
  borderBottom: "1px solid #eee",
};

const notificationUserStyle = {
  fontWeight: "bold",
  margin: "0 0 5px 0",
};

const notificationMessageStyle = {
  margin: "0 0 5px 0",
};

const notificationDateStyle = {
  fontSize: "0.8em",
  color: "#666",
  margin: 0,
};

const noNotificationStyle = {
  padding: "10px 15px",
  textAlign: "center",
  color: "#666",
};

const navbarStyle = {
  backgroundColor: "#0056b3",
  padding: "10px 0",
};

const navbarListStyle = {
  display: "flex",
  gap: "20px",
  justifyContent: "center",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const navbarItemStyle = {
  display: "inline-block",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "1.1em",
};

export default Header;
