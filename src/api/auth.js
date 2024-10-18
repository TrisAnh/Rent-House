// src/api/auth.js
import axiosInstance from "./axiosInstance";

export const login = (credentials) => {
  return axiosInstance.post("/auth/login", credentials);
};

export const register = (data) => {
  return axiosInstance.post("/auth/register", data);
};
export const verifyOtp = (email, otp) => {
  return axiosInstance.post("/auth/verify-otp", { email, otp });
};
// Gửi OTP tới email người dùng
export const sendOtp = (email) => {
  return axiosInstance.post("/auth/forgot-password", { email });
};

// Xác nhận OTP và đặt lại mật khẩu
export const resetPassword = (email, otp, newPassword) => {
  return axiosInstance.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
};
export const updateUser = (id, userData) => {
  return axiosInstance.put(`/auth/update/${id}`, userData);
};
