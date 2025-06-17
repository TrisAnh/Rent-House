import axiosInstance from "./axiosInstance";

export const createReport = (reportData) => {
  return axiosInstance.post("/report/create", reportData);
};
