// src/pages/Login.jsx
import React, { useState } from "react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Title,
  Form,
  Input,
  Button,
  Link,
  FooterText,
} from "./LoginStyled";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(""); // State để quản lý lỗi đăng nhập
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái tải

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError(""); // Reset lỗi khi người dùng thay đổi thông tin
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu quá trình đăng nhập
    try {
      const response = await loginApi(credentials);
      const userData = response.data;
      await login(userData);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(errorMessage);
      console.error("Đăng nhập thất bại", error);
    }
  };

  return (
    <Container>
      <Box>
        <Title>Đăng Nhập</Title>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* Hiển thị thông báo lỗi nếu có */}
        <Form onSubmit={handleSubmit}>
          <label>
            Email/Số điện thoại:
            <Input
              type="text"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Mật khẩu:
            <Input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </label>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </Button>
        </Form>
        <FooterText>
          <Link href="/forgot-password">Quên mật khẩu?</Link>
          <Link href="/register">Đăng ký</Link>
        </FooterText>
      </Box>
    </Container>
  );
};

export default Login;
