import styled from "styled-components";
import { Link } from "react-router-dom";

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f4f8;
  padding: 20px;
`;

export const LoginBox = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

export const LoginTitle = styled.h1`
  color: #2d3748;
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 700;
`;

export const ErrorMessage = styled.p`
  color: #e53e3e;
  background-color: #fff5f5;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

export const SubmitButton = styled.button`
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3182ce;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

export const FooterLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

export const FooterLink = styled(Link)`
  color: #4299e1;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #3182ce;
    text-decoration: underline;
  }
`;
