// HomeStyled.js

import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";
import BannerImage from "../assets/images/home-banner.jpg";
// Container chính cho trang Home
export const HomeContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
`;

// Phần banner
export const Banner = styled.div`
  width: 100%;
  height: 50vh;
  background-image: url(${BannerImage});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

export const BannerContent = styled.div`
  position: relative;
  z-index: 1;
`;

export const BannerTitle = styled.h1`
  font-size: 3rem;
  margin: 0;
  padding-bottom: 10px;
`;

export const BannerSubtitle = styled.p`
  font-size: 1.5rem;
  margin: 0;
  padding-bottom: 20px;
`;
// Phần tìm kiếm
export const SearchSection = styled.div`
  padding: 40px 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

export const SearchForm = styled.form`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  margin: 5px;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff; // Thay đổi màu biên khi focus
  }
`;

export const SearchSelect = styled.select`
  flex: 1;
  margin: 5px;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff; // Thay đổi màu biên khi focus
  }
`;

export const SearchButton = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3; // Màu nền khi hover
  }

  &:active {
    background-color: #004085; // Màu nền khi nhấn
  }
`;
// Phần hiển thị danh sách nhà trọ nổi bật
export const FeaturedSection = styled.section`
  margin-top: 20px;
`;

// Tiêu đề của phần nổi bật
export const SectionTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

// Lưới chứa các nhà trọ
export const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

// Card chứa thông tin mỗi nhà trọ
export const PropertyCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
`;

// Hình ảnh nhà trọ
export const PropertyImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

// Thông tin nhà trọ
export const PropertyInfo = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

// Tiêu đề nhà trọ
export const PropertyTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.25em; /* Kích thước chữ phù hợp */
`;

// Địa điểm nhà trọ
export const PropertyLocation = styled.p`
  color: #777;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
`;

// Giá nhà trọ
export const PropertyPrice = styled.p`
  font-weight: bold;
  color: #ff5a5f;
  margin: 5px 0;
  font-size: 1.15em; /* Kích thước chữ phù hợp */
`;

// Đánh giá nhà trọ
export const PropertyRating = styled.p`
  color: #777;
  margin: 5px 0;
  font-size: 1em; /* Kích thước chữ phù hợp */
`;

export const PropertyDetails = styled.div`
  margin-top: auto;
`;

export const PropertyAmenities = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const Amenity = styled.span`
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 5px;
  margin: 5px 5px 0 0;
  font-size: 0.9em; /* Kích thước chữ phù hợp */
`;
export const TestimonialsSection = styled.section`
  padding: 40px 20px;
  background-color: #f9f9f9;
  text-align: center;

  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;
export const ContactSection = styled.section`
  padding: 40px 20px;
  background-color: #fff;
  text-align: center;

  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

export const ContactItem = styled.div`
  font-size: 1rem;
  color: #666;
  margin: 5px 0;

  &:hover {
    color: #007bff; /* Thay đổi màu khi hover */
    cursor: pointer;
  }
`;
