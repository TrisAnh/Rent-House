import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaBed,
  FaRulerCombined,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaUtensils,
  FaRoute,
  FaChevronDown,
  FaHeart,
  FaClock,
  FaEye,
} from "react-icons/fa";
import { ArrowUpDown } from "lucide-react";
import {
  getPostByRoomType,
  getPostByDistrict,
  getDistricts,
  getLatestPosts,
} from "../api/post";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border-radius: 12px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #0050b3;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  border: 2px solid ${(props) => (props.$active ? "#1890ff" : "#e6f7ff")};
  font-size: 0.95rem;
  font-weight: 500;
  background-color: ${(props) => (props.$active ? "#1890ff" : "white")};
  color: ${(props) => (props.$active ? "white" : "#595959")};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
    border-color: #1890ff;
    color: ${(props) => (props.$active ? "white" : "#1890ff")};
  }
`;

const DistrictDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DistrictButton = styled(FilterButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DistrictList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  display: ${(props) => (props.$show ? "grid" : "none")};
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  width: 300px;
`;

const DistrictItem = styled.button`
  padding: 0.5rem;
  border: none;
  background-color: #f7fafc;
  color: #4a5568;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e6f7ff;
  }
`;

const ListingsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ListingCard = styled(Link)`
  display: grid;
  grid-template-columns: 300px 1fr;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-color: #2563eb;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ListingImageContainer = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ListingImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ListingCard}:hover & {
    transform: scale(1.05);
  }
`;

const ListingContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ListingTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.25rem;
  line-height: 1.4;
`;

const ListingPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
`;

const ListingLocation = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #2563eb;
    font-size: 1.1rem;
  }
`;

const ListingDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const ListingDetail = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #475569;

  svg {
    color: #2563eb;
  }
`;

const RoomTypeTag = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(37, 99, 235, 0.9);
  color: white;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
`;

const TimeStamp = styled.div`
  font-size: 0.8rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ViewDetailButton = styled.span`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #4299e1;
  color: #ffffff;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #3182ce;
    transform: translateY(-2px);
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const LoadingMessage = styled.div`
  color: #718096;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const PaginationButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 2px solid #2563eb;
  background: ${(props) => (props.disabled ? "#f1f5f9" : "white")};
  color: ${(props) => (props.disabled ? "#94a3b8" : "#2563eb")};
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:not(:disabled):hover {
    background: #2563eb;
    color: white;
  }
`;

const Sidebar = styled.aside`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const SidebarCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e40af;
  padding: 1.25rem;
  border-bottom: 2px solid #e2e8f0;
`;

const RecentListingCard = styled(Link)`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  border-bottom: 1px solid #e6f7ff;

  &:hover {
    background: #f0f9ff;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const RecentListingImage = styled.img`
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
`;

const RecentListingContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const RecentListingTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 500;
  color: #1e40af;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RecentListingPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #dc2626;
`;

const RecentListingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #8c8c8c;
`;

const ListingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const ListingViews = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #7f8c8d;
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
  const [showDistrictList, setShowDistrictList] = useState(false);
  const [recentListings, setRecentListings] = useState([]);

  const ITEMS_PER_PAGE = 9;

  const location = useLocation();

  useEffect(() => {
    fetchDistricts();
    fetchRecentListings();
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

  const fetchRecentListings = async () => {
    try {
      const response = await getLatestPosts();
      setRecentListings(response.data || []);
    } catch (err) {
      console.error("Error fetching recent listings:", err);
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const toggleDistrictList = () => {
    setShowDistrictList(!showDistrictList);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setShowDistrictList(false);
    fetchListingsByDistrict(district);
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
      <Header>
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
          <DistrictDropdown>
            <DistrictButton onClick={toggleDistrictList}>
              {selectedDistrict || "Chọn quận"} <FaChevronDown />
            </DistrictButton>
            <DistrictList $show={showDistrictList}>
              {districts.map((district) => (
                <DistrictItem
                  key={district}
                  onClick={() => handleDistrictSelect(district)}
                >
                  {district}
                </DistrictItem>
              ))}
            </DistrictList>
          </DistrictDropdown>
        </FiltersContainer>
      </Header>

      <MainContent>
        <ContentArea>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ListingsGrid>
            {paginatedListings.map((listing) => (
              <ListingCard key={listing._id} to={`/listings/${listing._id}`}>
                <ListingImageContainer>
                  <ListingImage
                    src={
                      listing.images[0]?.url ||
                      "/placeholder.svg?height=200&width=300"
                    }
                    alt={listing.title}
                  />
                  <RoomTypeTag>
                    {listing.roomType === "Single" ? "Phòng đơn" : "Phòng đôi"}
                  </RoomTypeTag>
                </ListingImageContainer>
                <ListingContent>
                  <ListingTitle>{listing.title}</ListingTitle>
                  <ListingLocation>
                    <FaRoute />
                    {listing.location.address}, {listing.location.district}
                  </ListingLocation>
                  <ListingPrice>
                    {listing.price.toLocaleString()} VND/tháng
                  </ListingPrice>
                  <ListingDetails>
                    <ListingDetail>
                      <FaRulerCombined />
                      {listing.size} m²
                    </ListingDetail>
                    {listing.amenities.hasWifi && (
                      <ListingDetail>
                        <FaWifi />
                        Wifi
                      </ListingDetail>
                    )}
                    {listing.amenities.hasParking && (
                      <ListingDetail>
                        <FaParking />
                        Bãi đỗ xe
                      </ListingDetail>
                    )}
                    {listing.amenities.hasAirConditioner && (
                      <ListingDetail>
                        <FaSnowflake />
                        Điều hòa
                      </ListingDetail>
                    )}
                  </ListingDetails>
                  <ListingFooter>
                    <ListingViews>
                      <FaEye /> {listing.views || 0} lượt xem
                    </ListingViews>
                    <TimeStamp>
                      <FaClock />
                      {new Date(listing.createdAt).toLocaleString("vi-VN")}
                    </TimeStamp>
                  </ListingFooter>
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
        </ContentArea>

        <Sidebar>
          <SidebarCard>
            <SidebarTitle>Tin mới đăng</SidebarTitle>
            {recentListings.slice(0, 5).map((listing) => (
              <RecentListingCard
                key={listing._id}
                to={`/listings/${listing._id}`}
              >
                <RecentListingImage
                  src={
                    listing.images[0]?.url ||
                    "/placeholder.svg?height=100&width=150"
                  }
                  alt={listing.title}
                />
                <RecentListingContent>
                  <RecentListingTitle>{listing.title}</RecentListingTitle>
                  <RecentListingPrice>
                    {listing.price.toLocaleString()} VND/tháng
                  </RecentListingPrice>
                  <RecentListingFooter>
                    <span>
                      <FaClock />{" "}
                      {new Date(listing.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    <span>
                      <FaEye /> {listing.views || 0}
                    </span>
                  </RecentListingFooter>
                </RecentListingContent>
              </RecentListingCard>
            ))}
          </SidebarCard>
        </Sidebar>
      </MainContent>
    </Container>
  );
};

export default Listings;
