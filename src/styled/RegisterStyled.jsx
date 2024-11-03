// src/pages/RegisterStyled.jsx
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e0f7fa; /* Màu nền xanh dương nhạt */
`;

export const Box = styled.div`
  background-color: white;
  border-radius: 8px;
  display: flex;
  width: 900px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
  }
`;

export const LeftSide = styled.div`
  flex: 1;
  background-color: #b2ebf2; /* Màu xanh dương nhạt cho phần bên trái */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  color: #006064; /* Màu chữ xanh đậm hơn để nổi bật trên nền nhạt */

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    display: none; /* Ẩn phần bên trái trên màn hình nhỏ */
  }
`;

export const RightSide = styled.div`
  flex: 1;
  padding: 3rem;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

export const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #0097a7;
  font-size: 1.2rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem; /* Đệm trái lớn để chỗ cho biểu tượng */
  font-size: 1rem;
  border: 1px solid #b2ebf2; /* Đường viền màu xanh dương nhạt */
  border-radius: 4px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0097a7; /* Đổi màu khi focus sang xanh đậm hơn */
    box-shadow: 0 0 5px rgba(0, 151, 167, 0.5);
  }

  &::placeholder {
    color: #999;
  }
`;

export const Button = styled.button`
  background-color: #0097a7; /* Nền nút màu xanh đậm hơn */
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #00796b; /* Đổi màu khi hover sang màu xanh đậm hơn */
  }

  &:active {
    background-color: #004d40; /* Đổi màu khi nhấn giữ */
  }
`;

export const Terms = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
  color: #666;
`;

export const LoginLink = styled.p`
  text-align: center;
  margin-top: 1rem;

  a {
    color: #0097a7; /* Liên kết màu xanh đậm hơn */
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Optional: Social Buttons (Nếu bạn muốn thêm nút đăng nhập bằng mạng xã hội)
export const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

export const SocialButton = styled.button`
  background-color: ${(props) => props.bgColor || "#ccc"};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#999"};
  }
`;
