import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 40px 0;
`;

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const FormCard = styled.form`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    padding: 25px;
  }
`;

export const FormTitle = styled.h1`
  font-size: 28px;
  color: #333;
  margin: 0 0 30px;
  text-align: center;
  font-weight: 600;
`;

export const FormSection = styled.section`
  margin-bottom: 30px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  color: #0056b3;
  margin: 0 0 20px;
  font-weight: 500;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;

  .hint {
    font-size: 13px;
    color: #666;
    margin-top: 5px;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 15px;
  color: #444;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #0056b3;
    box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }

  &[type="file"] {
    padding: 10px;
    border: 1px dashed #ddd;
    background-color: #f9f9f9;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #0056b3;
    box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;

  &:focus {
    outline: none;
    border-color: #0056b3;
    box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.1);
  }
`;

export const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const AmenityItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${(props) => (props.active ? "#0056b3" : "#eee")};
  background-color: ${(props) =>
    props.active ? "rgba(0, 86, 179, 0.05)" : "white"};

  span {
    margin-top: 8px;
    font-size: 14px;
    color: ${(props) => (props.active ? "#0056b3" : "#666")};
    font-weight: ${(props) => (props.active ? "500" : "normal")};
  }

  &:hover {
    border-color: #0056b3;
    background-color: ${(props) =>
      props.active ? "rgba(0, 86, 179, 0.05)" : "rgba(0, 86, 179, 0.02)"};
  }
`;

export const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#0056b3" : "#f5f7fa")};
  color: ${(props) => (props.active ? "white" : "#666")};
  font-size: 18px;
  transition: all 0.2s;
`;

export const MediaUploadSection = styled.div`
  margin-bottom: 25px;
`;

export const MediaPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

export const MediaItem = styled.div`
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  aspect-ratio: ${(props) => (props.isVideo ? "16/9" : "1")};

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    color: #666;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: white;
      color: #e74c3c;
    }
  }
`;

export const SubmitButton = styled.button`
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px 30px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 30px auto 0;

  &:hover {
    background-color: #004494;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const ErrorAlert = styled.div`
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 25px;
  font-size: 14px;
`;

export const FormDivider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 30px 0;
`;
