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

export const sendOtp = (email) => {
  return axiosInstance.post("/auth/forgot-password", { email });
};

export const resetPassword = (email, otp, newPassword) => {
  return axiosInstance.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
};
export const updateUser = (id, userData) => {
  return axiosInstance.put(`/auth/users/${id}`, userData);
};
export const updateRoleUser = (UserId, userData) => {
  return axiosInstance.put(`/auth/update-role-to-renter/${UserId}`, userData);
};
