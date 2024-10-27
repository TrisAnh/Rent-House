import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import styled from "styled-components";
import { getAllPosts } from "../api/post";
import { Link } from "react-router-dom";

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  background-color: #f8f9fa;
`;

const ListingCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ListingImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ListingCard}:hover & {
    transform: scale(1.1);
  }
`;

const ListingContent = styled.div`
  padding: 1.5rem;
`;

const ListingTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ListingDescription = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
`;

const ListingPrice = styled.p`
  font-size: 1.2rem;
  color: #007bff;
  font-weight: bold;
`;

const ListingLocation = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const AmenitiesList = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 1rem;
`;

const Amenity = styled.div`
  background-color: #e9ecef;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;

  button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        setListings(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  // Tính toán chỉ số bài viết cần hiển thị cho trang hiện tại
  const indexOfLastListing = currentPage * itemsPerPage;
  const indexOfFirstListing = indexOfLastListing - itemsPerPage;
  const currentListings = listings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  // Tính toán số trang
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  return (
    <div>
      <DetailContainer>
        {currentListings.map((listing) => (
          <ListingCard key={listing._id}>
            <Link to={`/listings/${listing._id}`}>
              <ListingImage src={listing.images[0]} alt={listing.title} />
            </Link>
            <ListingContent>
              <ListingTitle>{listing.title}</ListingTitle>
              <ListingDescription>{listing.description}</ListingDescription>
              <ListingPrice>
                {listing.price.toLocaleString()} VND/tháng
              </ListingPrice>
              <ListingLocation>
                <strong>Địa chỉ:</strong> {listing.location.address},{" "}
                {listing.location.ward}, {listing.location.district},{" "}
                {listing.location.city}
              </ListingLocation>
              <AmenitiesList>
                {Object.entries(listing.amenities)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <Amenity key={key}>{key}</Amenity>
                  ))}
              </AmenitiesList>
            </ListingContent>
          </ListingCard>
        ))}
      </DetailContainer>

      {/* Phần phân trang */}
      <Pagination>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span>{`Trang ${currentPage} / ${totalPages}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Tiếp theo
        </button>
      </Pagination>
    </div>
  );
};

export default Listings;
