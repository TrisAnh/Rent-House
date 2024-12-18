import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
`;

export const EditProfileCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
`;

export const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

export const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357ae8;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const MessageText = styled.p`
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;

  ${({ type }) =>
    type === "error"
      ? `
    background-color: #ffebee;
    color: #c62828;
  `
      : `
    background-color: #e8f5e9;
    color: #2e7d32;
  `}
`;

export const Icon = styled.span`
  margin-right: 8px;
  color: #4a90e2;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 20px;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-right: 5px;
  }
`;
