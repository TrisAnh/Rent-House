import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // THÊM IMPORT ICONS

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 20px;
`;

const LoginContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 420px;
  padding: 40px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 480px) {
    padding: 30px;
  }
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 35px;
  letter-spacing: -0.5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #4a5568;
  font-size: 15px;
  font-weight: 500;
  margin-left: 4px;
`;

// THÊM STYLED COMPONENT CHO PASSWORD CONTAINER
const PasswordContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: #f8fafc;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

// THÊM STYLED COMPONENT CHO PASSWORD INPUT
const PasswordInput = styled(Input)`
  padding-right: 48px; /* Tạo không gian cho icon */
`;

// THÊM STYLED COMPONENT CHO TOGGLE BUTTON
const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #3b82f6;
  }

  &:focus {
    outline: none;
    color: #3b82f6;
  }
`;

const SubmitButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

const StyledLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "⚠️";
  }
`;

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // THÊM STATE CHO HIỆN/ẨN PASSWORD

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginApi(credentials);
      const userData = response.data;
      await login(userData);
      navigate(userData.role === "renter" ? "/renter-header" : "/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(errorMessage);
      console.error("Đăng nhập thất bại", error);
    } finally {
      setLoading(false);
    }
  };

  // THÊM FUNCTION TOGGLE PASSWORD
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageContainer>
      <LoginContainer>
        <Title>Đăng Nhập</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email/Số điện thoại</Label>
            <Input
              type="text"
              id="email"
              name="email"
              placeholder="Nhập email hoặc số điện thoại"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Mật khẩu</Label>
            {/* SỬA PHẦN PASSWORD INPUT */}
            <PasswordContainer>
              <PasswordInput
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <ToggleButton
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </ToggleButton>
            </PasswordContainer>
          </FormGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </SubmitButton>
        </Form>
        <LinksContainer>
          <StyledLink href="/forgot-password">Quên mật khẩu?</StyledLink>
          <StyledLink href="/register">Đăng ký</StyledLink>
        </LinksContainer>
      </LoginContainer>
    </PageContainer>
  );
}