// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser, getUserById } from "../api/users";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const login = async (userData) => {
    const { token: tokenData } = userData;
    localStorage.setItem("token", tokenData);
    setToken(tokenData);
    try {
      const currentUserResponse = await getCurrentUser(tokenData);
      console.log("Current User Response:", currentUserResponse); // Thêm dòng này

      if (currentUserResponse.data && currentUserResponse.data.id) {
        const { id, email } = currentUserResponse.data;

        // Gọi API để lấy thông tin người dùng theo ID
        const userResponse = await getUserById(id, tokenData);
        const { username, phone, address } = userResponse.data;
        setUser({ id, email, username, phone, address });
        console.log("User logged in:", { id, email, username, phone, address });
      } else {
        throw new Error("ID không hợp lệ từ API getCurrentUser");
      }
    } catch (error) {
      console.error("Failed to fetch user profile after login", error);
      logout(); // Nếu có lỗi, thực hiện đăng xuất
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    console.log("User logged out");
  };

  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const currentUserResponse = await getCurrentUser(storedToken);

          // Kiểm tra ID từ response
          if (currentUserResponse.data && currentUserResponse.data.id) {
            const { id, email } = currentUserResponse.data;

            // Gọi API để lấy thông tin người dùng theo ID
            const userResponse = await getUserById(id, storedToken); // Đảm bảo id không phải là {id}
            const { username, phone, address } = userResponse.data;

            setUser({ id, email, username, phone, address });
            console.log("User fetched on mount:", {
              id,
              email,
              username,
              phone,
              address,
            });
          } else {
            throw new Error("ID không hợp lệ từ API getCurrentUser");
          }
        } catch (err) {
          console.error("Failed to fetch user profile on mount", err);
          logout(); // Nếu có lỗi, thực hiện đăng xuất
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
