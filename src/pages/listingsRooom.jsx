import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  getPostByRoomType,
  getPostByDistrict,
  getDistricts,
} from "../api/post";
import { Link } from "react-router-dom";
import {
  FaBed,
  FaRulerCombined,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaUtensils,
  faElevator,
  FaRoute,
} from "react-icons/fa";
import { colors } from "../styled/colors";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  background-color: ${colors.background};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${colors.primary};
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  font-size: 0.9rem;
  background-color: ${(props) =>
    props.$active ? colors.primary : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.text)};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.primary : colors.border};
    transform: translateY(-2px);
  }
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ListingCard = styled.div`
  background-color: ${colors.white};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

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
  padding: 1.5rem;
`;

const ListingTitle = styled.h2`
  font-size: 1.4rem;
  color: ${colors.text};
  margin-bottom: 0.8rem;
  font-weight: bold;
`;

const ListingDescription = styled.p`
  font-size: 1rem;
  color: ${colors.textLight};
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const ListingPrice = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${colors.accent};
  margin-bottom: 1rem;
`;

const ListingType = styled.span`
  font-size: 1rem;
  color: ${colors.white};
  background-color: ${(props) =>
    props.type === "single" ? colors.secondary : colors.primary};
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ListingInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ListingDetail = styled.p`
  font-size: 0.9rem;
  color: ${colors.textLight};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
    color: ${colors.primary};
  }
`;

const ViewDetailButton = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: ${colors.secondary};
  color: ${colors.white};
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${colors.primary};
    transform: translateY(-2px);
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.accent};
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const LoadingMessage = styled.div`
  color: ${colors.textLight};
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  font-size: 0.9rem;
  background-color: ${colors.primary};
  color: ${colors.white};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${colors.secondary};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: ${colors.border};
    cursor: not-allowed;
    transform: none;
  }
`;
const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roomType, setRoomType] = useState("all");

  const ITEMS_PER_PAGE = 9;

  const location = useLocation();

  useEffect(() => {
    fetchDistricts();
    const searchParams = new URLSearchParams(location.search);
    const districtParam = searchParams.get("district");
    const roomTypeParam = searchParams.get("roomType");

    if (districtParam) {
      setSelectedDistrict(districtParam);
      fetchListingsByDistrict(districtParam);
    } else if (roomTypeParam) {
      setRoomType(roomTypeParam);
      fetchListingsByRoomType(roomTypeParam);
    } else {
      fetchAllListings();
    }
  }, [location]);

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
      const allListings = await Promise.all([
        getPostByRoomType("Single"),
        getPostByRoomType("Double"),
      ]);
      const flattenedListings = allListings.flatMap(
        (response) => response.data || []
      );
      setListings(flattenedListings);
      setTotalPages(Math.ceil(flattenedListings.length / ITEMS_PER_PAGE));
      setSelectedDistrict("");
      setRoomType("all");
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching all listings:", err);
      setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchListingsByDistrict = async (district) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostByDistrict(district);
      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setError(
            `Hiện tại không có phòng trọ nào ở ${district}. Vui lòng thử lại sau hoặc chọn quận khác.`
          );
          setListings([]);
        } else {
          setListings(response.data);
          setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
        }
      } else {
        console.error(
          "Error: Invalid response data from API for district:",
          district
        );
        setError(
          `Không thể tải danh sách phòng ở ${district}. Vui lòng thử lại sau.`
        );
        setListings([]);
      }
      setSelectedDistrict(district);
      setCurrentPage(1);
    } catch (err) {
      console.error(`Error fetching listings for ${district}:`, err);
      setError(
        `Không thể tải danh sách phòng ở ${district}. Vui lòng thử lại sau.`
      );
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchListingsByRoomType = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostByRoomType(type);
      if (Array.isArray(response.data)) {
        setListings(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
      } else {
        console.error(
          "Error: Invalid response data from API for room type:",
          type
        );
        setError(
          `Không thể tải danh sách phòng loại ${type}. Vui lòng thử lại sau.`
        );
        setListings([]);
      }
      setRoomType(type);
      setCurrentPage(1);
    } catch (err) {
      console.error(`Error fetching listings for room type ${type}:`, err);
      setError(
        `Không thể tải danh sách phòng loại ${type}. Vui lòng thử lại sau.`
      );
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchListingNearBy = async (lat, lon, maxDistance) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://be-android-project.onrender.com/api/post/nearby",
        {
          params: {
            lat,
            lon,
            maxDistance,
          },
        }
      );

      console.log("Data" + response.data);
      if (Array.isArray(response.data)) {
        setListings(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
      } else {
        console.error(
          "Error: Invalid response data from API for near by",
          error
        );
        setError(
          `Không thể tải danh sách phòng loại gần đây. Vui lòng thử lại sau.`
        );
        setListings([]);
      }
      setRoomType("NearBy");
      setCurrentPage(1);
    } catch (err) {
      console.error(`Error fetching listings for near by`, err);
      setError(`Không thể tải danh sách phòng gần đây. Vui lòng thử lại sau.`);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <LoadingMessage>Đang tải...</LoadingMessage>;
  }

  const paginatedListings = listings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Container>
      <Title>Phòng Trọ Cho Thuê tại TP.HCM</Title>
      <FiltersContainer>
        <FilterButton
          $active={roomType === "all" && selectedDistrict === ""}
          onClick={fetchAllListings}
        >
          Tất cả
        </FilterButton>
        <FilterButton
          $active={roomType === "Single"}
          onClick={() => fetchListingsByRoomType("Single")}
        >
          Phòng đơn
        </FilterButton>
        <FilterButton
          $active={roomType === "Double"}
          onClick={() => fetchListingsByRoomType("Double")}
        >
          Phòng đôi
        </FilterButton>

        <FilterButton
          $active={roomType === "NearBy"}
          onClick={() => fetchListingNearBy(10.8411434, 106.7759268, 5000)}
        >
          Phòng trọ gần đây
        </FilterButton>
      </FiltersContainer>
      <FiltersContainer>
        {districts.map((district) => (
          <FilterButton
            key={district}
            $active={selectedDistrict === district}
            onClick={() => fetchListingsByDistrict(district)}
          >
            {district}
          </FilterButton>
        ))}
      </FiltersContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ListingsGrid>
        {paginatedListings.map((listing) => (
          <ListingCard key={listing._id}>
            <ListingImage
              src={
                listing.images[0]?.url ||
                "/placeholder.svg?height=200&width=300"
              }
              alt={listing.title}
            />
            <ListingContent>
              <ListingTitle>{listing.title}</ListingTitle>
              <ListingDescription>
                {listing.location.address}, {listing.location.district},{" "}
                {listing.location.city}
              </ListingDescription>
              <ListingInfo>
                <ListingPrice>
                  {listing.price.toLocaleString()} VND/tháng
                </ListingPrice>
                <ListingType type={listing.roomType.toLowerCase()}>
                  {listing.roomType === "Single" ? "Phòng đơn" : "Phòng đôi"}
                </ListingType>
              </ListingInfo>
              <ListingDetail>
                <FaBed /> <strong>Loại phòng:</strong>{" "}
                {listing.roomType === "Single" ? "Phòng đơn" : "Phòng đôi"}
              </ListingDetail>
              <ListingDetail>
                <FaRulerCombined /> <strong>Diện tích:</strong> {listing.size}{" "}
                m²
              </ListingDetail>
              <ListingDetail>
                <strong>Tiện ích:</strong>{" "}
                {listing.amenities.hasWifi && <FaWifi title="Wifi" />}
                {listing.amenities.hasParking && (
                  <FaParking title="Bãi đậu xe" />
                )}
                {listing.amenities.hasAirConditioner && (
                  <FaSnowflake title="Điều hòa" />
                )}
                {listing.amenities.hasKitchen && <FaUtensils title="Nhà bếp" />}
                {listing.amenities.hasElevator && (
                  <faElevator title="Thang máy" />
                )}
              </ListingDetail>
              <ListingDetail>
                {listing.distance && (
                  <>
                    <FaRoute />
                    <strong>Khoảng cách:</strong>{" "}
                    {`${parseFloat(listing.distance).toFixed(2)} km`}
                  </>
                )}
              </ListingDetail>
              <ViewDetailButton to={`/listings/${listing._id}`}>
                Xem chi tiết
              </ViewDetailButton>
            </ListingContent>
          </ListingCard>
        ))}
      </ListingsGrid>
      <PaginationContainer>
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trang trước
        </PaginationButton>
        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </PaginationButton>
      </PaginationContainer>
    </Container>
  );
};

export default Listings;
