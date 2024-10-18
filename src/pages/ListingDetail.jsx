// src/pages/ListingDetail.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import styled from "styled-components";

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: auto;
  background-color: white;
  border-radius: 8px;
`;

// Mock data nếu bạn chưa kết nối API
const mockListing = {
  id: 1,
  title: "Phòng trọ đẹp 1",
  description: "Phòng trọ tiện nghi, đầy đủ nội thất, gần trung tâm...",
  price: 5000000,
  image: "https://via.placeholder.com/800x400",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  amenities: ["Internet", "Điều hòa", "Bếp"],
  contact: "0901234567",
};

const ListingDetail = () => {
  const { id } = useParams();
  // Nếu bạn có API, hãy sử dụng useFetch hoặc useEffect để lấy dữ liệu theo id
  const listing = mockListing; // Thay bằng dữ liệu thực tế

  return (
    <div>
      <Header />
      <DetailContainer>
        <h2>{listing.title}</h2>
        <img
          src={listing.image}
          alt={listing.title}
          style={{ width: "100%", height: "400px", objectFit: "cover" }}
        />
        <p>{listing.description}</p>
        <p>Giá: {listing.price.toLocaleString()} VND/tháng</p>
        <p>
          <strong>Địa chỉ:</strong> {listing.address}
        </p>
        <p>
          <strong>Tiện ích:</strong> {listing.amenities.join(", ")}
        </p>
        <p>
          <strong>Liên hệ:</strong> {listing.contact}
        </p>
      </DetailContainer>
      <Footer />
    </div>
  );
};

export default ListingDetail;
