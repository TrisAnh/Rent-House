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
    if (userData && userData.user && userData.token) {
      const { id, username, email, phone, address, user_role } = userData.user;
      const token = userData.token;
      const refreshToken = userData.refreshToken;
      console.log("token", token);
      // Cập nhật thông tin người dùng và token
      setUser({ id, username, email, phone, address, user_role });
      setToken(token);

      // Lưu vào localStorage để tự động đăng nhập lần sau
      localStorage.setItem(
        "user",
        JSON.stringify({ id, username, email, phone, address, user_role })
      );
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("authcontext", user_role);
      console.log("Thông tin người dùng đăng nhập thành công:", userData.user);
    } else {
      console.error("Thông tin người dùng không đầy đủ");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    console.log("User logged out");
  };

  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);

        try {
          // Kiểm tra xem token có hợp lệ hay không bằng cách gọi API getCurrentUser
          const currentUserResponse = await getCurrentUser(storedToken);

          if (currentUserResponse.data && currentUserResponse.data.id) {
            const { id, email, username, phone, address, user_role } =
              currentUserResponse.data;
            setUser({ id, email, username, phone, address, user_role });
            console.log("User fetched on mount:", {
              id,
              email,
              username,
              phone,
              address,
              user_role,
            });
          } else {
            throw new Error("ID không hợp lệ từ API getCurrentUser");
          }
        } catch (err) {
          console.error("Failed to fetch user profile on mount", err);
          setError(err.message);
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        user_role: user?.user_role,
        token,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const updateRole = async (userId, newRole) => {
};

export default AuthProvider;
