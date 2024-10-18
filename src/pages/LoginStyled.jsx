// src/pages/LoginStyled.jsx
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e3f2fd; /* Màu nền xanh dương nhạt */
`;

export const Box = styled.div`
  background-color: white;
  border-radius: 12px; /* Bo tròn các góc */
  display: flex;
  flex-direction: column; /* Thay đổi hướng của box thành cột */
  width: 400px; /* Chiều rộng của box đăng nhập */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Đổ bóng cho box */
  padding: 2rem; /* Padding cho box */
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1976d2; /* Màu chữ xanh dương */
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%; /* Đảm bảo form chiếm 100% chiều rộng của box */
`;

export const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #90caf9; /* Đường viền màu xanh dương nhạt */
  border-radius: 4px;
  transition: border 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1976d2; /* Đổi màu khi focus sang xanh dương đậm */
  }
`;

export const Button = styled.button`
  background-color: #1976d2; /* Nền nút màu xanh dương */
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #115293; /* Đổi màu khi hover sang màu xanh đậm hơn */
  }
`;

export const Link = styled.a`
  text-align: center;
  color: #1976d2; /* Màu xanh dương cho các liên kết */
  text-decoration: underline;
  margin-top: 0.5rem;
`;

export const FooterText = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem; /* Giảm kích thước chữ cho footer */
`;
