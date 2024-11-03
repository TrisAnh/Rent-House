import styled from "styled-components";

// Container chính
export const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: auto;
  padding: 20px; /* Thêm padding cho container chính */
  background-color: #f4f6f8; /* Màu nền nhẹ cho toàn bộ trang */
`;

// Container chi tiết
export const DetailContainer = styled.div`
  padding: 2.5rem;
  max-width: 800px;
  background-color: #fff; /* Đổi màu nền cho container chi tiết */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// Section
export const Section = styled.section`
  margin-bottom: 2rem;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

// Container cho slider
export const SliderContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

// Hình ảnh
export const Image = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
  transition: transform 0.3s ease, filter 0.3s ease;
  &:hover {
    transform: scale(1.05);
    filter: brightness(0.9);
  }
`;

// Video
export const Video = styled.video`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 16px;
`;

// Tiêu đề
export const Title = styled.h2`
  margin-bottom: 1rem;
  color: #2c3e50;
  font-weight: 600;
  text-align: center;
  font-size: 1.8rem;
`;

// Văn bản thông tin
export const InfoText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 0.5rem 0;
  color: #4a4a4a;
`;

// Nút yêu thích
export const FavoriteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ isFavorited }) => (isFavorited ? "#e74c3c" : "#555")};
  transition: color 0.3s;
  &:hover {
    color: #e74c3c;
  }
`;

// Văn bản giá
export const PriceText = styled.p`
  font-size: 1.6rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 1rem 0;
`;

// Wrapper cho icon
export const IconWrapper = styled.span`
  margin-right: 0.5rem;
  color: #007bff;
`;

// Danh sách
export const List = styled.ul`
  list-style-type: none;
  padding: 0;
  font-size: 1rem;
`;

// Mục danh sách
export const ListItem = styled.li`
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
`;
// Wrapper phần contact để phần này có thể di chuyển theo khi cuộn
export const ContactContainer = styled.div`
  position: sticky;
  top: 20px; /* Giữ khoảng cách cố định khi cuộn */
  flex: 1;
  background-color: #e3f2fd;
  padding: 2.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid #90caf9;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  margin: 0 auto; /* Căn giữa theo chiều ngang */

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px); /* Hiệu ứng nâng khi rê chuột */
  }
`;

// Tiêu đề liên hệ
export const ContactTitle = styled.h3`
  color: #1565c0;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
`;

// Phần chứa thông tin liên hệ chính
export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  text-align: center;
`;

// Ảnh đại diện với hiệu ứng nổi khi hover
export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

// Tên liên hệ
export const ContactName = styled.h4`
  color: #333;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0.5rem 0;
`;

// Trạng thái online với text bên cạnh
export const OnlineStatusWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const OnlineStatus = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ online }) => (online ? "#4caf50" : "#f44336")};
  margin-right: 0.5rem;
`;

// Text trạng thái
export const StatusText = styled.span`
  font-size: 1rem;
  color: #333;
`;

// Số điện thoại
export const PhoneText = styled.p`
  font-size: 1.6rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 1rem 0;
  transition: color 0.3s;

  &:hover {
    color: #c0392b;
  }
`;

// Địa chỉ hoặc thông tin khác
export const ContactText = styled.p`
  font-size: 0.9rem;
  color: #555;
`;

// Nút đặt lịch với hiệu ứng khi rê chuột
export const BookButton = styled.button`
  margin-top: 1rem;
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #2980b9;
    transform: scale(1.05);
  }
`;
// form đặt lịch
export const BookingFormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 300px; /* Đặt chiều rộng tùy ý */
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  color: #555;
`;

export const FormButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

export const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;

  &:hover {
    background-color: #d32f2f;
  }
`;
