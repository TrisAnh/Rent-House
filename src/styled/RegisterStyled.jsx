import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 2rem;
`;

export const Box = styled.div`
  background-color: white;
  border-radius: 20px;
  display: flex;
  width: 1000px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2196f3, #64b5f6);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 500px;
  }
`;

export const LeftSide = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 3rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    top: -50%;
    left: -50%;
    animation: rotate 60s linear infinite;
  }

  h1 {
    font-size: 2.75rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
  }

  p {
    font-size: 1.25rem;
    line-height: 1.6;
    text-align: center;
    max-width: 80%;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 2rem;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1.1rem;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const RightSide = styled.div`
  flex: 1;
  padding: 3.5rem;
  background: white;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputWrapper = styled.div`
  position: relative;
  transition: transform 0.2s ease;

  &:focus-within {
    transform: translateY(-2px);
  }
`;

export const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #2196f3;
  font-size: 1.25rem;
  pointer-events: none;
  transition: color 0.2s ease;

  ${InputWrapper}:focus-within & {
    color: #1976d2;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1rem;
  border: 2px solid #e3f2fd;
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2196f3;
    background: white;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(33, 150, 243, 0.2);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Terms = styled.p`
  margin-top: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
  color: #64748b;
  line-height: 1.5;
`;

export const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;

  a {
    color: #2196f3;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: #1976d2;
      text-decoration: underline;
    }
  }
`;

export const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
`;

export const SocialButton = styled.button`
  background-color: ${(props) => props.bgColor || "#f1f5f9"};
  color: ${(props) => props.textColor || "#64748b"};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    background-color: ${(props) => props.hoverBgColor || "#e2e8f0"};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const FormTitle = styled.h2`
  color: #1e293b;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #475569;
  font-size: 0.95rem;
  font-weight: 500;
`;

export const InputError = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
`;

export const SuccessMessage = styled.div`
  background-color: #dcfce7;
  color: #166534;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
`;
