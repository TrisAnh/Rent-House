// src/components/HeaderStyled.jsx
import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #004ba0; /* Màu xanh dương đậm tinh tế */
  padding: 15px 40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Tạo độ sâu cho header */
`;

export const Logo = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    color: #ffffff;
    font-size: 30px;
    font-weight: 700;
    margin: 0;
    font-family: "Roboto", sans-serif; /* Kiểu chữ hiện đại */
  }

  p {
    color: #e0e0e0;
    font-size: 14px;
    margin: 0;
    font-family: "Roboto", sans-serif;
  }
`;

export const Navbar = styled.nav`
  flex: 1;
  display: flex;
  justify-content: center;

  ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;

    li {
      margin: 0 20px;

      a {
        color: #ffffff;
        text-decoration: none;
        font-weight: 500;
        padding: 10px 20px;
        border-radius: 25px;
        transition: all 0.3s ease;
        font-family: "Roboto", sans-serif;

        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        &.highlighted {
          background-color: #ff4081;
          color: #ffffff;
          padding: 12px 20px;
          font-weight: 600;
          transition: background-color 0.3s;

          &:hover {
            background-color: #e91e63;
          }
        }
      }
    }
  }
`;

export const AuthButtons = styled.div`
  display: flex;
  align-items: center;

  .login-button {
    color: #ffffff;
    text-decoration: none;
    margin-right: 20px;
    padding: 10px 20px;
    border: 2px solid #ffffff;
    border-radius: 25px;
    transition: all 0.3s ease;
    font-family: "Roboto", sans-serif;

    &:hover {
      background-color: #ffffff;
      color: #004ba0;
      border-color: #004ba0;
    }
  }

  .register-button {
    color: #ffffff;
    text-decoration: none;
    padding: 10px 20px;
    background-color: #ff4081;
    border-radius: 25px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    font-family: "Roboto", sans-serif;

    &:hover {
      background-color: #e91e63;
      transform: scale(1.05);
    }
  }
`;

export const PostButton = styled.div`
  margin-left: 20px;

  .post-button {
    color: #ffffff;
    background-color: #ff4081;
    padding: 12px 24px;
    text-decoration: none;
    border-radius: 25px;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.3s ease;
    font-family: "Roboto", sans-serif;

    &:hover {
      background-color: #e91e63;
      transform: scale(1.05);
    }
  }
`;
