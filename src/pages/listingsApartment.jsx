import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  getPostByRoomType,
  getPostByDistrict,
  getDistricts,
  getLatestPosts,
} from "../api/post";
import {
  FaBed,
  FaRulerCombined,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaUtensils,
  FaClock,
  FaEye,
  FaChevronDown,
} from "react-icons/fa";
import { ArrowUpDown } from "lucide-react";
import styled from "styled-components";

const ITEMS_PER_PAGE = 9;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border-radius: 12px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #0050b3;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
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

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ListingsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const ListingCard = styled(Link)`
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
`;

const ListingImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
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

export default function ApartmentListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentListings, setRecentListings] = useState([]);
  const [showDistrictList, setShowDistrictList] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const district = searchParams.get("district");

  useEffect(() => {
    fetchDistricts();
    fetchRecentListings();
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
      const response = await getPostByRoomType("Apartment");
      const apartmentListings = response.data || [];
      setListings(apartmentListings);
      setTotalPages(Math.ceil(apartmentListings.length / ITEMS_PER_PAGE));
      setSelectedDistrict("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching all listings:", err);
      setError("Không thể tải danh sách căn hộ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchListingsByDistrict = async (district) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostByDistrict(district);
      const apartmentListings = (response.data || []).filter(
        (listing) => listing.roomType === "Apartment"
      );
      if (apartmentListings.length === 0) {
        setError(
          `Hiện tại không có căn hộ nào ở ${district}. Vui lòng thử lại sau hoặc chọn quận khác.`
        );
        setListings([]);
      } else {
        setListings(apartmentListings);
        setTotalPages(Math.ceil(apartmentListings.length / ITEMS_PER_PAGE));
      }
      setSelectedDistrict(district);
      setCurrentPage(1);
    } catch (err) {
      console.error(`Error fetching listings for ${district}:`, err);
      setError(
        `Không thể tải danh sách căn hộ ở ${district}. Vui lòng thử lại sau.`
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
      navigate("/apartment");
      fetchAllListings();
    } else {
      navigate(`/apartment?district=${encodeURIComponent(district)}`);
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
        <Title>Căn hộ Cho Thuê tại TP.HCM</Title>
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

      <MainContent>
        <div>
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
                </ListingImageContainer>
                <ListingContent>
                  <ListingTitle>{listing.title}</ListingTitle>
                  <ListingLocation>
                    {listing.location.address}, {listing.location.district},{" "}
                    {listing.location.city}
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
                    {listing.amenities.hasKitchen && (
                      <ListingDetail>
                        <FaUtensils />
                        Nhà bếp
                      </ListingDetail>
                    )}
                    {listing.amenities.hasElevator && (
                      <ListingDetail>
                        <ArrowUpDown />
                        Thang máy
                      </ListingDetail>
                    )}
                  </ListingDetails>
                  <ListingFooter>
                    <span>
                      <FaClock />{" "}
                      {new Date(listing.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    <span>
                      <FaEye /> {listing.views || 0} lượt xem
                    </span>
                  </ListingFooter>
                </ListingContent>
              </ListingCard>
            ))}
          </ListingsGrid>

          <div className="flex justify-center mt-8 space-x-4">
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
          </div>
        </div>

        <Sidebar>
          <SidebarCard>
            <SidebarTitle>Tin mới đây</SidebarTitle>
            {recentListings.slice(0, 5).map((listing) => (
              <RecentListingCard
                key={listing._id}
                to={`/listings/${listing._id}`}
              >
                <RecentListingImage
                  src={
                    listing.images[0]?.url ||
                    "/placeholder.svg?height=80&width=100"
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
}
