import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  getPostByRoomType,
  getPostByDistrict,
  getDistricts,
} from "../api/post";
import {
  FaUserFriends,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaUtensils,
  FaChevronDown,
} from "react-icons/fa";
import styled from "styled-components";
import { ArrowUpDown } from "lucide-react";
const ITEMS_PER_PAGE = 9;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.$active ? "#3498db" : "#ecf0f1")};
  color: ${(props) => (props.$active ? "white" : "#34495e")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.$active ? "#2980b9" : "#bdc3c7")};
  }
`;

const DistrictDropdown = styled.div`
  position: relative;
`;

const DistrictList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ecf0f1;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  display: ${(props) => (props.$show ? "block" : "none")};
`;

const DistrictItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #ecf0f1;
  }
`;

const ListingsGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const ListingCard = styled(Link)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ListingImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ListingContent = styled.div`
  padding: 1rem;
`;

const ListingTitle = styled.h2`
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ListingLocation = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ListingPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 1rem;
`;

const ListingDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ListingDetail = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #34495e;
  background-color: #ecf0f1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const ListingAmenities = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AmenityIcon = styled.span`
  color: #3498db;
  font-size: 1.2rem;
`;

const ViewDetailsButton = styled(Link)`
  display: inline-block;
  width: 100%;
  text-align: center;
  background-color: #3498db;
  color: white;
  padding: 0.75rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
`;

export default function SharedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDistrictList, setShowDistrictList] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const district = searchParams.get("district");

  useEffect(() => {
    fetchDistricts();
    if (district) {
      setSelectedDistrict(district);
      fetchListingsByDistrict(district);
    } else {
      fetchAllListings();
    }
  }, [district]);

  const fetchDistricts = async () => {
    try {
      const response = await getDistricts();
      setDistricts(response.data || []);
    } catch (err) {
      console.error("Error fetching districts:", err);
      setError("Không thể tải danh sách quận. Vui lòng thử lại sau.");
    }
  };

  const fetchAllListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostByRoomType("Shared");
      const sharedListings = response.data || [];
      setListings(sharedListings);
      setTotalPages(Math.ceil(sharedListings.length / ITEMS_PER_PAGE));
      setSelectedDistrict("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching all listings:", err);
      setError("Không thể tải danh sách phòng ở ghép. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchListingsByDistrict = async (district) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostByDistrict(district);
      const sharedListings = (response.data || []).filter(
        (listing) => listing.roomType === "Shared"
      );
      if (sharedListings.length === 0) {
        setError(
          `Hiện tại không có phòng ở ghép nào ở ${district}. Vui lòng thử lại sau hoặc chọn quận khác.`
        );
        setListings([]);
      } else {
        setListings(sharedListings);
        setTotalPages(Math.ceil(sharedListings.length / ITEMS_PER_PAGE));
      }
      setSelectedDistrict(district);
      setCurrentPage(1);
    } catch (err) {
      console.error(`Error fetching listings for ${district}:`, err);
      setError(
        `Không thể tải danh sách phòng ở ghép ở ${district}. Vui lòng thử lại sau.`
      );
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleDistrictChange = (district) => {
    if (district === "") {
      navigate("/shared");
      fetchAllListings();
    } else {
      navigate(`/shared?district=${encodeURIComponent(district)}`);
      fetchListingsByDistrict(district);
    }
    setShowDistrictList(false);
  };

  const toggleDistrictList = () => {
    setShowDistrictList(!showDistrictList);
  };

  const paginatedListings = listings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <Container>
        <p className="text-center text-xl text-gray-600">Đang tải...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Tìm Người Ở Ghép tại TP.HCM</Title>
        <FiltersContainer>
          <FilterButton
            $active={selectedDistrict === ""}
            onClick={() => handleDistrictChange("")}
          >
            Tất cả
          </FilterButton>
          <DistrictDropdown>
            <FilterButton onClick={toggleDistrictList}>
              {selectedDistrict || "Chọn quận"} <FaChevronDown />
            </FilterButton>
            <DistrictList $show={showDistrictList}>
              {districts.map((district) => (
                <DistrictItem
                  key={district}
                  onClick={() => handleDistrictChange(district)}
                >
                  {district}
                </DistrictItem>
              ))}
            </DistrictList>
          </DistrictDropdown>
        </FiltersContainer>
      </Header>

      {error && <p className="text-center text-red-600 mb-6">{error}</p>}

      <ListingsGrid>
        {paginatedListings.map((listing) => (
          <ListingCard key={listing._id} to={`/listings/${listing._id}`}>
            <ListingImage
              src={
                listing.images[0]?.url ||
                "/placeholder.svg?height=200&width=300"
              }
              alt={listing.title}
            />
            <ListingContent>
              <ListingTitle>{listing.title}</ListingTitle>
              <ListingLocation>
                <FaMapMarkerAlt />
                {listing.location.address}, {listing.location.district}
              </ListingLocation>
              <ListingPrice>
                {listing.price.toLocaleString()} VND/tháng
              </ListingPrice>
              <ListingDetails>
                <ListingDetail>
                  <FaUserFriends />
                  Số người: {listing.maxOccupants || "Chưa xác định"}
                </ListingDetail>
                <ListingDetail>
                  <FaRulerCombined />
                  {listing.size} m²
                </ListingDetail>
              </ListingDetails>
              <ListingAmenities>
                {listing.amenities.hasWifi && (
                  <AmenityIcon title="Wifi">
                    <FaWifi />
                  </AmenityIcon>
                )}
                {listing.amenities.hasParking && (
                  <AmenityIcon title="Bãi đậu xe">
                    <FaParking />
                  </AmenityIcon>
                )}
                {listing.amenities.hasAirConditioner && (
                  <AmenityIcon title="Điều hòa">
                    <FaSnowflake />
                  </AmenityIcon>
                )}
                {listing.amenities.hasKitchen && (
                  <AmenityIcon title="Nhà bếp">
                    <FaUtensils />
                  </AmenityIcon>
                )}
                {listing.amenities.hasElevator && (
                  <AmenityIcon title="Thang máy">
                    <ArrowUpDown />
                  </AmenityIcon>
                )}
              </ListingAmenities>
              <ViewDetailsButton to={`/listings/${listing._id}`}>
                Xem chi tiết
              </ViewDetailsButton>
            </ListingContent>
          </ListingCard>
        ))}
      </ListingsGrid>

      <PaginationContainer>
        <FilterButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trang trước
        </FilterButton>
        <FilterButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </FilterButton>
      </PaginationContainer>
    </Container>
  );
}
