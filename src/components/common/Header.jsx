"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MdNotifications, MdMenu, MdClose } from "react-icons/md";
import { getNotification } from "../../api/notifications";
import PostAlertSubscriptionForm from "../../pages/CreateAlert";
import { Button } from "@mui/material";

const Header = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false); // State cho modal nhận tin
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // State cho custom notification modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalContent, setLoginModalContent] = useState({
    title: "",
    message: "",
    feature: "",
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        if (user && user.id) {
          const response = await getNotification(user.id);
          console.log("Dữ liệu thông báo:", response.data);
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    } else {
      setIsLoading(false);
      setNotifications([]);
    }
  }, [user]);

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

  // Function hiển thị modal yêu cầu đăng nhập
  const showLoginRequiredModal = (feature) => {
    const content = {
      "nhận tin": {
        title: "Đăng nhập để nhận tin",
        message:
          "Bạn cần đăng nhập để sử dụng tính năng nhận thông báo về phòng trọ mới phù hợp với yêu cầu của bạn.",
        feature: "nhận tin",
      },
      "đặt lịch": {
        title: "Đăng nhập để đặt lịch",
        message:
          "Bạn cần đăng nhập để có thể đặt lịch xem phòng và quản lý các cuộc hẹn của mình.",
        feature: "đặt lịch",
      },
    };

    setLoginModalContent(content[feature]);
    setShowLoginModal(true);
  };

  const handleReceiveNewsClick = () => {
    if (!user) {
      showLoginRequiredModal("nhận tin");
      return;
    }
    setOpen(true);
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

  // Style cho nút "Nhận tin"
  const receiveNewsButtonStyle = {
    backgroundColor: "#38a169",
    color: "white",
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "5px",
    fontSize: "1em",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: "auto",
    textTransform: "none",
    fontFamily: "inherit",
    boxShadow: "none",
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

  const mobileReceiveNewsButtonStyle = {
    backgroundColor: "#38a169",
    color: "white",
    textDecoration: "none",
    padding: "12px 20px",
    borderRadius: "5px",
    fontSize: "1em",
    fontWeight: "500",
    margin: "5px 0",
    textAlign: "center",
    border: "none",
    cursor: "pointer",
  };

  const mobileNavDividerStyle = {
    height: "1px",
    backgroundColor: "#0056b3",
    margin: "10px 0",
  };

  // Login Modal Styles
  const loginModalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    backdropFilter: "blur(5px)",
  };

  const loginModalStyle = {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    width: "90%",
    maxWidth: "450px",
    textAlign: "center",
    position: "relative",
    animation: "modalFadeIn 0.3s ease-out",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    cursor: "pointer",
    fontSize: "16px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };

  const modalIconStyle = {
    fontSize: "64px",
    marginBottom: "16px",
  };

  const modalTitleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "16px",
    paddingRight: "40px",
  };

  const modalMessageStyle = {
    fontSize: "16px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "32px",
  };

  const modalButtonsStyle = {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const primaryButtonStyle = {
    backgroundColor: "#0056b3",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    minWidth: "120px",
    justifyContent: "center",
  };

  const secondaryButtonStyle = {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    minWidth: "120px",
    justifyContent: "center",
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

          {/* Nút Nhận tin */}
          <Button
            onClick={handleReceiveNewsClick}
            style={receiveNewsButtonStyle}
            startIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "16px", height: "16px" }}
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            }
          >
            Nhận tin
          </Button>

          <Link to="/phone" style={postButtonStyle}>
            ➕ Đăng ký đăng tin
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

            {/* Nút Nhận tin cho mobile */}
            <button
              onClick={() => {
                if (!user) {
                  showLoginRequiredModal("nhận tin");
                  setMobileMenuOpen(false);
                  return;
                }
                setOpen(true);
                setMobileMenuOpen(false);
              }}
              style={mobileReceiveNewsButtonStyle}
            >
              🔔 Nhận tin
            </button>

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
              Phòng trọ
            </Link>
            <Link
              to="/apartment"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Căn hộ
            </Link>
            <Link
              to="/shared"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Ở ghép
            </Link>
            <Link
              to="/Blog"
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tin tức
            </Link>
            {user ? (
              <Link
                to="/inforbooking"
                style={mobileLinkStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                Đặt lịch
              </Link>
            ) : (
              <span
                style={mobileLinkStyle}
                onClick={() => {
                  showLoginRequiredModal("đặt lịch");
                  setMobileMenuOpen(false);
                }}
              >
                Đặt lịch
              </span>
            )}
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
              Phòng trọ
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/apartment" style={linkStyle}>
              Căn hộ
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/shared" style={linkStyle}>
              Ở ghép
            </Link>
          </li>
          <li style={navbarItemStyle}>
            <Link to="/Blog" style={linkStyle}>
              Tin tức
            </Link>
          </li>
          <li style={navbarItemStyle}>
            {user ? (
              <Link to="/inforbooking" style={linkStyle}>
                Đặt lịch
              </Link>
            ) : (
              <span
                style={{ ...linkStyle, cursor: "pointer" }}
                onClick={() => showLoginRequiredModal("đặt lịch")}
              >
                Đặt lịch
              </span>
            )}
          </li>
        </ul>
      </nav>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div style={loginModalOverlayStyle}>
          <div style={loginModalStyle}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={closeButtonStyle}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
            >
              ✕
            </button>

            <div style={modalIconStyle}>🔐</div>

            <h3 style={modalTitleStyle}>{loginModalContent.title}</h3>

            <p style={modalMessageStyle}>{loginModalContent.message}</p>

            <div style={modalButtonsStyle}>
              <Link
                to="/login"
                style={primaryButtonStyle}
                onClick={() => setShowLoginModal(false)}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#004494")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#0056b3")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: "16px", height: "16px" }}
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10,17 15,12 10,7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Đăng nhập
              </Link>

              <Link
                to="/register"
                style={secondaryButtonStyle}
                onClick={() => setShowLoginModal(false)}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e5e7eb")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: "16px", height: "16px" }}
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="22" y1="11" x2="16" y2="11"></line>
                </svg>
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nhận tin */}
      <PostAlertSubscriptionForm open={open} onClose={() => setOpen(false)} />

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @media (max-width: 768px) {
          .login-modal {
            width: 95%;
            padding: 24px;
          }
          
          .modal-title {
            font-size: 20px;
            padding-right: 35px;
          }
          
          .modal-message {
            font-size: 14px;
          }
          
          .modal-buttons {
            flex-direction: column;
          }
          
          .modal-buttons a {
            width: 100%;
            margin-bottom: 8px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
