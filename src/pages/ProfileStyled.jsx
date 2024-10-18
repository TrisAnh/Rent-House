// src/pages/ProfileStyled.js
import styled from "styled-components";

// Định nghĩa biến màu để dễ dàng quản lý
const colors = {
  primary: "#007bff",
  secondary: "#6c757d",
  background: "#f0f2f5",
  white: "#ffffff",
  lightGray: "#e9ecef",
  darkGray: "#343a40",
  success: "#28a745",
  error: "#dc3545",
};

// Container: Trung tâm hóa nội dung và tạo nền mềm mại hơn
export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${colors.background};
  padding: 20px; // Thêm padding cho các thiết bị nhỏ
`;

// Box: Thêm độ bo tròn lớn hơn, bóng đổ sâu hơn và tối ưu hóa responsive
export const Box = styled.div`
  background: ${colors.white};
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;

  @media (max-width: 700px) {
    padding: 30px 20px;
  }
`;

// Title: Tăng kích thước font và thêm màu sắc
export const Title = styled.h2`
  margin-bottom: 25px;
  text-align: center;
  font-size: 1.8rem;
  color: ${colors.darkGray};
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

// InfoContainer: Để hiển thị thông tin người dùng
export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// InfoItem: Để hiển thị từng mục thông tin
export const InfoItem = styled.div`
  display: flex;
  margin-bottom: 15px;
  align-items: center;
`;

// Label: Nhãn cho thông tin
export const Label = styled.span`
  width: 150px;
  font-weight: 500;
  color: ${colors.darkGray};
`;

// Value: Giá trị của thông tin
export const Value = styled.span`
  color: ${colors.darkGray};
`;

// Button: Nút để chỉnh sửa hoặc thực hiện hành động khác
export const Button = styled.button`
  padding: 10px 20px;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  align-self: center;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${colors.secondary};
    cursor: not-allowed;
    transform: none;
  }
`;

// MessageText: Định dạng thông báo thành công hoặc lỗi
export const MessageText = styled.p`
  color: ${(props) => (props.type === "error" ? colors.error : colors.success)};
  text-align: center;
  margin-bottom: 15px;
  font-weight: 500;
`;
