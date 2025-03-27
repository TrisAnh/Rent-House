import styled, { keyframes } from "styled-components";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Container
export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 120px);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

// Card
export const ProfileCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;
  margin-top: 20px;

  @media (max-width: 576px) {
    border-radius: 8px;
  }
`;

export const ProfileHeader = styled.div`
  background-color: #0056b3;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (max-width: 576px) {
    padding: 30px 15px;
  }
`;

export const ProfileContent = styled.div`
  padding: 30px;

  @media (max-width: 576px) {
    padding: 20px 15px;
  }
`;

// Avatar
export const AvatarContainer = styled.div`
  margin-bottom: 15px;
  position: relative;
`;

export const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 576px) {
    width: 100px;
    height: 100px;
  }
`;

export const AvatarInitials = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0056b3;
  color: white;
  font-size: 40px;
  font-weight: bold;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 576px) {
    width: 100px;
    height: 100px;
    font-size: 32px;
  }
`;

export const UserName = styled.h1`
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  text-align: center;

  @media (max-width: 576px) {
    font-size: 20px;
  }
`;

// Info Section
export const InfoSection = styled.section`
  margin-bottom: 30px;

  h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background-color: #0056b3;
    }
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

export const InfoCard = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
`;

export const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e6f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #0056b3;
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  flex: 1;
`;

export const InfoLabel = styled.p`
  margin: 0;
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
`;

export const InfoValue = styled.p`
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  word-break: break-word;
`;

// Buttons
export const ActionButton = styled.button`
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 250px;
  margin: 0 auto;

  &:hover {
    background-color: #004494;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 86, 179, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 576px) {
    padding: 10px 20px;
    font-size: 14px;
  }
`;

// Messages
export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #d4edda;
  color: #155724;
  padding: 12px 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.3s ease-out;
  width: 100%;
  max-width: 800px;

  svg {
    margin-right: 10px;
    background-color: #155724;
    color: white;
    border-radius: 50%;
    padding: 3px;
  }
`;

// Loading
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 86, 179, 0.1);
  border-radius: 50%;
  border-top-color: #0056b3;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 15px;
`;

export const LoadingText = styled.p`
  color: #6c757d;
  font-size: 16px;
`;

// Skeleton Loading
export const SkeletonCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 800px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SkeletonAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e9ecef;
  animation: ${pulse} 1.5s infinite;
  margin-bottom: 20px;
`;

export const SkeletonLine = styled.div`
  height: ${(props) => props.height || "16px"};
  width: ${(props) => props.width || "100%"};
  background-color: #e9ecef;
  border-radius: 4px;
  margin: ${(props) => props.margin || "10px 0"};
  animation: ${pulse} 1.5s infinite;
`;

export const SkeletonButton = styled.div`
  height: 45px;
  width: 200px;
  background-color: #e9ecef;
  border-radius: 6px;
  margin-top: 30px;
  animation: ${pulse} 1.5s infinite;
`;
