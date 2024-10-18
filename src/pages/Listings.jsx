// src/pages/Listings.jsx
import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ListingCard from "../components/listings/ListingCard";
import styled from "styled-components";

const ListingsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem;
`;

// Mock data nếu bạn chưa kết nối API
const mockListings = [
  {
    id: 1,
    title: "Phòng trọ đẹp 1",
    description: "Phòng trọ tiện nghi, đầy đủ nội thất...",
    price: 5000000,
    image: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    title: "Phòng trọ đẹp 2",
    description: "Phòng trọ sạch sẽ, gần trung tâm...",
    price: 6000000,
    image: "https://via.placeholder.com/300x200",
  },
  // Thêm các bản ghi khác
];

const Listings = () => {
  // Nếu bạn có API, hãy sử dụng useFetch hoặc useEffect để lấy dữ liệu
  const listings = mockListings;

  return (
    <div>
      <ListingsContainer>
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </ListingsContainer>
    </div>
  );
};

export default Listings;
