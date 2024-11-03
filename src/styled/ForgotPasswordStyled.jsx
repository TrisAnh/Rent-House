// src/pages/ForgotPasswordStyled.js
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
  max-width: 450px;

  @media (max-width: 500px) {
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

// Form: Sử dụng flex column và thêm khoảng cách giữa các thành phần
export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

// Label: Thêm margin và font-weight cho nhãn
export const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
  color: ${colors.darkGray};
`;

// Input: Cải thiện thiết kế input với viền mềm mại và hiệu ứng focus
export const Input = styled.input`
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid ${colors.lightGray};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: ${colors.primary};
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  &::placeholder {
    color: ${colors.lightGray};
    font-style: italic;
  }
`;

// Button: Cải thiện nút bấm với màu sắc sống động và hiệu ứng hover
export const Button = styled.button`
  padding: 12px 15px;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

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

// LinkText: Cải thiện liên kết với hiệu ứng hover và font-weight
export const LinkText = styled.a`
  color: ${colors.primary};
  text-decoration: none;
  margin: 15px 0 10px 0;
  text-align: center;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

// FooterText: Định dạng lại khoảng cách và font-size
export const FooterText = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: 0.9rem;
  color: ${colors.darkGray};
`;

// MessageText: Định dạng thông báo thành công hoặc lỗi
export const MessageText = styled.p`
  color: ${(props) => (props.type === "error" ? colors.error : colors.success)};
  text-align: center;
  margin-bottom: 15px;
  font-weight: 500;
`;
