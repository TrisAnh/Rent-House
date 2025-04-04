"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MdKeyboardArrowDown } from "react-icons/md";
import { getNotification } from "../../api/notifications";

const RenterHeader = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(user.id);
        console.log("Dữ liệu thông báo:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (user) {
      fetchNotifications();
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

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
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

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Get user's initials for avatar
  {
    /*} const getUserInitials = () => {
    if (!user || !user.username) return "PT";

    const nameParts = user.username.split(" ");
    if (nameParts.length >= 2) {
      return (
        nameParts[0][0] + nameParts[nameParts.length - 1][0]
      ).toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };*/
  }

  // Get user's display name
  const getDisplayName = () => {
    return user?.username || "Phan Thanh Hau";
  };

  return (
    <div style={styles.headerWrapper}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          {/* Logo and Main Navigation */}
          <div style={styles.leftSection}>
            <Link to="/" style={styles.logoContainer}>
              <h1 style={styles.logoText}>RENT-HOUSE.COM</h1>
              <p style={styles.logoSubtext}>
                Kênh thông tin phòng trọ số 1 Việt Nam
              </p>
            </Link>

            <nav style={styles.mainNav}>
              <Link to="/listings" style={styles.navLink}>
                Phòng trọ
              </Link>
              {/* <Link to="/rent-house" style={styles.navLink}>
                Nhà nguyên căn
              </Link>*/}
              <div style={styles.dropdownContainer}>
                <Link to="/apartment" style={styles.navLinkWithDropdown}>
                  Căn hộ
                </Link>
              </div>
              <Link to="/shared" style={styles.navLink}>
                Ở ghép
              </Link>
              {/* <Link to="/rent-space" style={styles.navLink}>
                Mặt bằng
              </Link>*/}
              <Link to="/Blog" style={styles.navLink}>
                Blog
              </Link>
              {/* <Link
                to="/pricing"
                style={{ ...styles.navLink, ...styles.lastNavItem }}
              >
                Bảng giá dịch vụ
              </Link>*/}
            </nav>
          </div>

          {/* User Actions */}
          <div style={styles.userActions}>
            {/* Saved Posts */}
            <Link to="/favourite" style={styles.actionButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={styles.actionIcon}
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Tin đã lưu</span>
            </Link>

            {/* Management */}
            <Link to="/listingLandlord" style={styles.actionButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={styles.actionIcon}
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Quản lý</span>
            </Link>

            {/* Notifications */}
            <div style={styles.notificationContainer} ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                style={styles.notificationButton}
                aria-label="Thông báo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={styles.actionIcon}
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>

              {showNotifications && (
                <div style={styles.notificationDropdown}>
                  <h3 style={styles.notificationHeader}>
                    Thông báo từ hệ thống
                  </h3>
                  <div style={styles.notificationList}>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          style={styles.notificationItem}
                        >
                          <p style={styles.notificationUser}>
                            {notification.id_user.username}
                          </p>
                          <p style={styles.notificationMessage}>
                            {notification.message}
                          </p>
                          <p style={styles.notificationDate}>
                            {new Date(notification.create_at).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p style={styles.noNotification}>
                        Không có thông báo mới
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            {user ? (
              <div style={styles.userProfileContainer} ref={userMenuRef}>
                <div style={styles.userProfile} onClick={toggleUserMenu}>
                  <div style={styles.avatar}></div>
                  <span style={styles.userName}>
                    {getDisplayName()}
                    <MdKeyboardArrowDown style={styles.dropdownIcon} />
                  </span>
                </div>

                {showUserMenu && (
                  <div style={styles.userMenuDropdown}>
                    <Link to="/profile" style={styles.userMenuItem}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={styles.menuItemIcon}
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <div style={styles.userMenuItem} onClick={logout}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={styles.menuItemIcon}
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Đăng xuất</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" style={styles.actionButton}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={styles.actionIcon}
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span>Đăng nhập</span>
                </Link>
                <Link to="/register" style={styles.actionButton}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={styles.actionIcon}
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  <span>Đăng ký</span>
                </Link>
              </>
            )}
            <div
              style={styles.actionButton}
              onClick={() => {
                window.dispatchEvent(new Event("toggleChat"));
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={styles.actionIcon}
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>Nhắn tin</span>
            </div>
            {/* Post Button */}
                        <Link to="/package" style={styles.packageButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{...styles.actionIcon, marginRight: '6px'}}
              >
                <path d="M20.91 8.84L8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67z"></path>
                <path d="M3.09 8.84v7.2a2.06 2.06 0 0 0 1.3 1.87l10.82 4.07a2.19 2.19 0 0 0 1.8-.01l4.91-2a1.99 1.99 0 0 0 1.1-1.83V12"></path>
                <path d="M12 16l-8.97-5.67"></path>
              </svg>
              <span>Mua gói đăng bài</span>
            </Link>
            <Link to="/create-post" style={styles.postButton}>
              Đăng tin
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

const styles = {
  headerWrapper: {
    width: "100%",
    backgroundColor: "#0056b3",
  },
  packageButton: {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#38a169', 
  color: 'white',
  textDecoration: 'none',
  padding: '7px 14px',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: '500',
  marginLeft: '4px',
},
  header: {
    backgroundColor: "#0056b3",
    color: "white",
    width: "100%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 20px",
    height: "60px",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "48px",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
    color: "white",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0,
    letterSpacing: "0.5px",
    lineHeight: "1.2",
    color: "white",
  },
  logoSubtext: {
    fontSize: "9px",
    margin: "1px 0 0 0",
    color: "#e5e7eb",
    lineHeight: "1",
  },
  mainNav: {
    display: "flex",
    gap: "28px",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "max-content",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "400",
    padding: "0",
    height: "100%",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
  navLinkWithDropdown: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "400",
    padding: "0",
    height: "100%",
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  dropdownContainer: {
    position: "relative",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  dropdownIcon: {
    width: "16px",
    height: "16px",
    marginTop: "2px",
  },
  userActions: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "400",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    whiteSpace: "nowrap",
  },
  actionIcon: {
    width: "16px",
    height: "16px",
  },
  notificationContainer: {
    position: "relative",
  },
  notificationButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDropdown: {
    position: "absolute",
    top: "40px",
    right: "-100px",
    width: "320px",
    backgroundColor: "white",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
  },
  notificationHeader: {
    padding: "12px 16px",
    margin: 0,
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },
  notificationList: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  notificationItem: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
  },
  notificationUser: {
    margin: "0 0 4px 0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },
  notificationMessage: {
    margin: "0 0 4px 0",
    fontSize: "14px",
    color: "#374151",
  },
  notificationDate: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
  },
  noNotification: {
    padding: "16px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  },
  userProfileContainer: {
    position: "relative",
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1b2d57",
    fontSize: "13px",
    fontWeight: "600",
  },
  userName: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    fontSize: "14px",
    fontWeight: "400",
  },
  userMenuDropdown: {
    position: "absolute",
    top: "40px",
    right: "0",
    width: "200px",
    backgroundColor: "white",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    overflow: "hidden",
  },
  userMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    color: "#374151",
    textDecoration: "none",
    fontSize: "14px",
    cursor: "pointer",
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s",
  },
  menuItemIcon: {
    width: "16px",
    height: "16px",
    color: "#6b7280",
  },
  postButton: {
    backgroundColor: "#e63946",
    color: "white",
    textDecoration: "none",
    padding: "7px 14px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    marginLeft: "4px",
  },
  lastNavItem: {
    marginRight: "40px",
  },
};

export default RenterHeader;
