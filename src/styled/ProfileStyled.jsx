import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
`;

export const ProfileCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: block;
  border: 3px solid #3498db;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const InfoItem = styled.li`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 0.5rem;
`;

export const Label = styled.span`
  font-weight: bold;
  color: #7f8c8d;
  width: 100px;
`;

export const Value = styled.span`
  color: #34495e;
  flex: 1;
`;

export const EditButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  display: block;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: #2980b9;
  }
`;

export const MessageText = styled.p`
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
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

const skeletonAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const SkeletonLoader = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 300px;
    background-image: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200px 100%;
    background-repeat: no-repeat;
    animation: ${skeletonAnimation} 1.2s ease-in-out infinite;
  }
`;
