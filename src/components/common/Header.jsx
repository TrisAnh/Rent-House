"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MdNotifications, MdMenu, MdClose } from "react-icons/md";
import { getNotification } from "../../api/notifications";

const Header = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Apply media queries
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Fetch notifications using the getNotification function
    const fetchNotifications = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        if (user && user.id) {
          const response = await getNotification(user.id); // API call to fetch notifications
          console.log("Dữ liệu thông báo:", response.data);
          setNotifications(response.data); // Store the notifications in the state
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching, regardless of success or failure
      }
    };

    if (user) {
      fetchNotifications(); // Only fetch notifications if the user is logged in
    } else {
      setIsLoading(false); // If no user, set loading to false immediately
      setNotifications([]); // Clear existing notifications
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

  // Styles
  const headerContainerStyle = {
    backgroundColor: "#fff",
    borderBottom: "2px solid #0056b3",
    position: "relative",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    flexWrap: "wrap",
  };

  const logoContainerStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const logoTextStyle = {
    fontSize: isMobile ? "1.5em" : "2em",
    color: "#0056b3",
    margin: 0,
    fontWeight: "bold",
  };

  const logoSubTextStyle = {
    fontSize: isMobile ? "0.8em" : "0.9em",
    margin: 0,
    color: "#666",
  };

  const topNavStyle = {
    display: isMobile ? "none" : "flex",
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
    right: isMobile ? "-10px" : 0,
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: isMobile ? "calc(100vw - 40px)" : "300px",
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
    display: isMobile ? "none" : "block",
  };

  const navbarListStyle = {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    listStyle: "none",
    margin: 0,
    padding: 0,
    flexWrap: "wrap",
  };

  const navbarItemStyle = {
    display: "inline-block",
    margin: "5px 0",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "1.1em",
    padding: "5px 10px",
  };

  // Mobile styles
  const mobileMenuButtonStyle = {
    display: isMobile ? "block" : "none",
  };

  const mobileButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    color: "#0056b3",
  };

  const mobileMenuStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 1000,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    padding: "10px 0",
  };

  const mobileMenuLinksStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "0 20px",
  };

  const mobileLinkStyle = {
    color: "#333",
    textDecoration: "none",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    fontSize: "1em",
    cursor: "pointer",
  };

  const mobileUserInfoStyle = {
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    fontWeight: "bold",
    color: "#0056b3",
  };

  const mobilePostButtonStyle = {
    backgroundColor: "#ff5733",
    color: "white",
    textDecoration: "none",
    padding: "12px 20px",
    borderRadius: "5px",
    fontSize: "1.1em",
    fontWeight: "bold",
    margin: "10px 0",
    textAlign: "center",
  };

  const mobileNavDividerStyle = {
    height: "1px",
    backgroundColor: "#0056b3",
    margin: "10px 0",
  };

  return (
    <header style={headerContainerStyle}>
      <div style={topBarStyle}>
        <div style={logoContainerStyle}>
          <h1 style={logoTextStyle}>Rent-House.com</h1>
          <p style={logoSubTextStyle}>Kênh thông tin phòng trọ số 1 Việt Nam</p>
        </div>

        {/* Mobile menu button */}
        <div style={mobileMenuButtonStyle}>
          <button
            onClick={toggleMobileMenu}
            style={mobileButtonStyle}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>

        {/* Desktop navigation */}
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
                <h3 style={notificationHeaderStyle}>Thông báo từ hệ thống</h3>
                {isLoading ? (
                  <p style={noNotificationStyle}>Đang tải thông báo...</p>
                ) : notifications.length > 0 ? (
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={mobileMenuStyle} ref={mobileMenuRef}>
          <div style={mobileMenuLinksStyle}>
            {user ? (
              <>
                <span style={mobileUserInfoStyle}>👤 {user.email}</span>
                <Link to="/profile" style={mobileLinkStyle}>
                  Hồ sơ
                </Link>
                <span
                  style={mobileLinkStyle}
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
                  style={mobileLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Đăng nhập
                </Link>
                <Link
                  to="/register"
                  style={mobileLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📝 Đăng ký
                </Link>
              </>
            )}
            <Link
              to="/favourite"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              ❤️ Yêu thích
            </Link>
            <Link
              to="/phone"
              style={mobilePostButtonStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              ➕ Đăng tin miễn phí
            </Link>

            <div style={mobileNavDividerStyle}></div>

            <Link
              to="/"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/listings"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Cho thuê phòng trọ
            </Link>
            <Link
              to="/apartment"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Cho thuê căn hộ
            </Link>
            <Link
              to="/shared"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tìm người ở ghép
            </Link>
            <Link
              to="/Blog"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tin tức
            </Link>
            <Link
              to="/inforbooking"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Đặt lịch
            </Link>
          </div>
        </div>
      )}

      {/* Desktop navbar */}
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
            <Link to="/apartment" style={linkStyle}>
              Cho thuê căn hộ
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/shared" style={linkStyle}>
              Tìm người ở ghép
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/Blog" style={linkStyle}>
              Tin tức
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/inforbooking" style={linkStyle}>
              Đặt lịch
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
