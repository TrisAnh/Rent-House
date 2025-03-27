"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MdNotifications, MdMenu, MdClose } from "react-icons/md";
import { getNotification } from "../../api/notifications";
import "./Header.css"; // Giả sử bạn sẽ tạo file CSS riêng

const HeaderReponsive = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    // Fetch notifications using the getNotification function
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(user.id); // API call to fetch notifications
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

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header-container">
      <div className="top-bar">
        <div className="logo-container">
          <h1 className="logo-text">Rent-House.com</h1>
          <p className="logo-subtext">Kênh thông tin phòng trọ số 1 Việt Nam</p>
        </div>

        {/* Mobile menu button */}
        <div className="mobile-menu-button">
          <button
            onClick={toggleMobileMenu}
            className="mobile-button"
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="top-nav">
          <Link to="/favourite" className="top-nav-link">
            ❤️ Yêu thích
          </Link>

          {user ? (
            <>
              <span className="user-info" onClick={logout}>
                👤 {user.email} (Đăng xuất)
              </span>
              <Link to="/profile" className="top-nav-link">
                Hồ sơ
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="top-nav-link">
                👤 Đăng nhập
              </Link>
              <Link to="/register" className="top-nav-link">
                📝 Đăng ký
              </Link>
            </>
          )}
          <Link to="/phone" className="post-button">
            ➕ Đăng tin miễn phí
          </Link>

          <div className="notification-container" ref={notificationRef}>
            <button
              onClick={toggleNotifications}
              className="notification-button"
              aria-label="Thông báo"
            >
              <MdNotifications size={24} color="#333" />
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <h3 className="notification-header">Thông báo từ hệ thống</h3>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification._id} className="notification-item">
                      <p className="notification-user">
                        {notification.id_user.username}
                      </p>
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <p className="notification-date">
                        {new Date(notification.create_at).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="no-notification">Không có thông báo mới</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" ref={mobileMenuRef}>
          <div className="mobile-menu-links">
            {user ? (
              <>
                <span className="mobile-user-info">👤 {user.email}</span>
                <Link to="/profile" className="mobile-link">
                  Hồ sơ
                </Link>
                <span
                  className="mobile-link"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Đăng xuất
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📝 Đăng ký
                </Link>
              </>
            )}
            <Link
              to="/favourite"
              className="mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              ❤️ Yêu thích
            </Link>
            <Link
              to="/phone"
              className="mobile-post-button"
              onClick={() => setMobileMenuOpen(false)}
            >
              ➕ Đăng tin miễn phí
            </Link>

            <div className="mobile-nav-divider"></div>

            <Link
              to="/"
              className="mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/listings"
              className="mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cho thuê phòng trọ
            </Link>
            <Link
              to="/apartment"
              className="mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cho thuê căn hộ
            </Link>
            <Link
              to="/shared"
              className="mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tìm người ở ghép
            </Link>
            <Link
              to="/Blog"
              className="mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tin tức
            </Link>
            <Link
              to="/inforbooking"
              className="mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Đặt lịch
            </Link>
          </div>
        </div>
      )}

      {/* Desktop navbar */}
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/" className="nav-link">
              Trang chủ
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/listings" className="nav-link">
              Cho thuê phòng trọ
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/apartment" className="nav-link">
              Cho thuê căn hộ
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/shared" className="nav-link">
              Tìm người ở ghép
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/Blog" className="nav-link">
              Tin tức
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/inforbooking" className="nav-link">
              Đặt lịch
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderReponsive;
