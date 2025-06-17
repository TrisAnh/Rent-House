"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  getPostByRoomType,
  getPostByDistrict,
  getDistricts,
  getLatestPosts,
  searchPost,
  getAllBlogs,
} from "../api/post";
import {
  FaRulerCombined,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaUtensils,
  FaClock,
  FaEye,
  FaChevronDown,
  FaMapMarkerAlt,
  FaFilter,
  FaSearch,
  FaListAlt,
  FaUserFriends,
} from "react-icons/fa";
import { ArrowUpDown } from "lucide-react";
import styled from "styled-components";

const ITEMS_PER_PAGE = 6;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
`;

const Header = styled.header`
  margin-bottom: 1.5rem;
`;

const StatsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
`;

const StatsText = styled.span`
  font-size: 0.875rem;
  color: #333;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  justify-content: space-between;
`;

const FilterButtonsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.$active ? "#3498db" : "#f5f5f5")};
  color: ${(props) => (props.$active ? "white" : "#333")};
  border: 1px solid ${(props) => (props.$active ? "#3498db" : "#e0e0e0")};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${(props) => (props.$active ? "#2980b9" : "#e0e0e0")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DistrictDropdown = styled.div`
  position: relative;
`;

const DistrictList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background-color: white;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  width: 250px;
  display: ${(props) => (props.$show ? "grid" : "none")};
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.75rem;
`;

const DistrictItem = styled.button`
  padding: 0.5rem 0.75rem;
  text-align: left;
  background: #f8f9fa;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #34495e;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ecf0f1;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex-grow: 1;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ListingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const CategoryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: #ecf0f1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
`;

const ResultCount = styled.div`
  font-size: 0.875rem;
  color: #3498db;
  font-weight: 500;
`;

const ListingCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 1px solid #ecf0f1;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ListingImageContainer = styled.div`
  position: relative;
  height: 200px;

  @media (min-width: 768px) {
    width: 40%;
    height: auto;
  }
`;

const ListingImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${ListingCard}:hover & {
    transform: scale(1.05);
  }
`;

const ListingType = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
`;

const ListingContent = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (min-width: 768px) {
    width: 60%;
  }
`;

const ListingTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const ListingLocation = styled.div`
  font-size: 0.875rem;
  color: #7f8c8d;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

const LocationIcon = styled.span`
  color: #f39c12;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

const ListingPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
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
  font-size: 0.875rem;
  background: #ecf0f1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: #34495e;
`;

const ListingAmenities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AmenityBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  background: #ecf0f1;
  color: #3498db;
`;

const ListingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #ecf0f1;
  font-size: 0.75rem;
  color: #7f8c8d;
`;

const FooterItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const SidebarCard = styled.div`
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
`;

const SidebarHeader = styled.div`
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SidebarContent = styled.div`
  padding: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: #7f8c8d;
`;

const StatValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #3498db;
`;

const RecentListingCard = styled(Link)`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-bottom: 1px solid #ecf0f1;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const RecentListingImage = styled.img`
  width: 4rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 4px;
`;

const RecentListingContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const RecentListingTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RecentListingPrice = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 0.25rem;
`;

const RecentListingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #7f8c8d;
`;

const DistrictTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DistrictTag = styled.button`
  padding: 0.375rem 0.75rem;
  background-color: ${(props) => (props.$active ? "#3498db" : "#ecf0f1")};
  color: ${(props) => (props.$active ? "white" : "#34495e")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.75rem;
  font-weight: 500;

  &:hover {
    background-color: ${(props) => (props.$active ? "#2980b9" : "#bdc3c7")};
  }
`;

const ErrorMessage = styled.div`
  background-color: #fde2e2;
  border-left: 4px solid #e74c3c;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  color: #c0392b;
  font-size: 0.875rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #ecf0f1;
`;

const NoResultsIcon = styled.div`
  font-size: 2rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
`;

const NoResultsText = styled.p`
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
  display: none; 
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
  display: none; 
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PriceRangeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const PriceRangeButton = styled.button`
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #34495e;
  padding: 0.5rem 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #e74c3c;
  }
`;

const PriceRangeArrow = styled.span`
  color: #e74c3c;
  font-size: 1rem;
`;

const BlogLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  text-decoration: none;
  color: #34495e;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #3498db;
  }
`;

const BlogArrow = styled.span`
  color: #e74c3c;
  font-size: 1rem;
`;


const FooterSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const FooterTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const FooterText = styled.div`
  font-size: 0.95rem;
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const FooterHighlight = styled.span`
  font-weight: 600;
  color: #3498db;
`;

const FooterExpandButton = styled.button`
  display: block;
  margin: 1rem auto 0;
  padding: 0.5rem 1.5rem;
  background-color: #ecf0f1;
  border: none;
  border-radius: 4px;
  color: #3498db;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e6e9;
  }
`;

const FooterExpandedContent = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  display: ${(props) => (props.$expanded ? "block" : "none")};
`;

export default function SharedRoomListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentListings, setRecentListings] = useState([]);
  const [showDistrictList, setShowDistrictList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalShared, setTotalShared] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [footerExpanded, setFooterExpanded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const district = searchParams.get("district");

  useEffect(() => {
    fetchDistricts();
    fetchRecentListings();
    fetchTotalShared();
    fetchBlogs();
    if (district) {
      setSelectedDistrict(district);
      fetchListingsByDistrict(district);
    } else {
      fetchAllListings();
    }
  }, [district]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDistrictList && !event.target.closest(".district-dropdown")) {
        setShowDistrictList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDistrictList]);

  const fetchTotalShared = async () => {
    try {
      const response = await getPostByRoomType("Shared");
      setTotalShared((response.data || []).length);
    } catch (err) {
      console.error("Error fetching total shared rooms:", err);
    }
  };

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

  const fetchBlogs = async () => {
    try {
      const response = await getAllBlogs();
      setBlogs(response.data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
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

  const fetchListingsByPriceRange = async (priceMin, priceMax) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchPost({ priceMin, priceMax });
      const sharedListings = (response.data || []).filter(
        (listing) => listing.roomType === "Shared"
      );
      if (sharedListings.length === 0) {
        setError(
          `Không tìm thấy phòng ở ghép trong khoảng giá ${priceMin.toLocaleString()} - ${priceMax.toLocaleString()} VND. Vui lòng thử lại với khoảng giá khác.`
        );
        setListings([]);
      } else {
        setListings(sharedListings);
        setTotalPages(Math.ceil(sharedListings.length / ITEMS_PER_PAGE));
      }
      setSelectedDistrict("");
      setCurrentPage(1);
      navigate("/shared");
    } catch (err) {
      console.error(`Error fetching listings for price range:`, err);
      setError(
        `Không thể tải danh sách phòng ở ghép trong khoảng giá. Vui lòng thử lại sau.`
      );
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      listing.location.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCategoryTitle = () => {
    if (selectedDistrict) {
      return `Phòng ở ghép tại ${selectedDistrict}`;
    } else {
      return "Tất cả phòng ở ghép";
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <div
            style={{
              width: "3rem",
              height: "3rem",
              border: "4px solid #ecf0f1",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <p style={{ color: "#7f8c8d", fontSize: "1rem" }}>
            Đang tải dữ liệu...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </Container>
    );
  }

  const toggleFooterExpanded = () => {
    setFooterExpanded(!footerExpanded);
  };

  return (
    <Container>
      <Header>
        <Title>Tìm Người Ở Ghép tại TP.HCM</Title>
        <Subtitle>
          Khám phá các phòng ở ghép với đầy đủ tiện nghi, vị trí thuận lợi và
          giá cả hợp lý tại Thành phố Hồ Chí Minh
        </Subtitle>
        <StatsContainer>
          <FaListAlt style={{ color: "#3498db" }} />
          <StatsText>Tổng số: {totalShared} phòng ở ghép</StatsText>
        </StatsContainer>
      </Header>

      <FiltersContainer>
        <FilterButtonsWrapper>
          <FilterButton
            $active={selectedDistrict === ""}
            onClick={() => handleDistrictChange("")}
          >
            <FaFilter /> Tất cả
          </FilterButton>

          <DistrictDropdown className="district-dropdown">
            <FilterButton
              $active={selectedDistrict !== ""}
              onClick={toggleDistrictList}
            >
              <FaMapMarkerAlt />
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
        </FilterButtonsWrapper>

        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm theo tên, địa chỉ..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>
      </FiltersContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <MainContent>
        <ListingsContainer>
          {!loading && !error && (
            <CategoryHeader>
              <CategoryTitle>
                <CategoryIcon>
                  <FaUserFriends />
                </CategoryIcon>
                {getCategoryTitle()}
              </CategoryTitle>
              <ResultCount>{filteredListings.length} kết quả</ResultCount>
            </CategoryHeader>
          )}

          {!loading && paginatedListings.length === 0 && !error && (
            <NoResults>
              <NoResultsIcon>
                <FaSearch />
              </NoResultsIcon>
              <NoResultsText>
                Không tìm thấy kết quả phù hợp với tiêu chí tìm kiếm của bạn.
              </NoResultsText>
              <FilterButton
                $active={false}
                onClick={() => handleDistrictChange("")}
              >
                Xem tất cả phòng ở ghép
              </FilterButton>
            </NoResults>
          )}

          {paginatedListings.map((listing) => (
            <ListingCard key={listing._id} to={`/listings/${listing._id}`}>
              <ListingImageContainer>
                <ListingImage
                  src={
                    listing.images[0]?.url ||
                    "/placeholder.svg?height=240&width=320"
                  }
                  alt={listing.title}
                />
                <ListingType>Ở ghép</ListingType>
              </ListingImageContainer>

              <ListingContent>
                <ListingTitle>{listing.title}</ListingTitle>

                <ListingLocation>
                  <LocationIcon>
                    <FaMapMarkerAlt />
                  </LocationIcon>
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
                    <AmenityBadge>
                      <FaWifi />
                      Wifi
                    </AmenityBadge>
                  )}

                  {listing.amenities.hasParking && (
                    <AmenityBadge>
                      <FaParking />
                      Bãi đỗ xe
                    </AmenityBadge>
                  )}

                  {listing.amenities.hasAirConditioner && (
                    <AmenityBadge>
                      <FaSnowflake />
                      Điều hòa
                    </AmenityBadge>
                  )}

                  {listing.amenities.hasKitchen && (
                    <AmenityBadge>
                      <FaUtensils />
                      Nhà bếp
                    </AmenityBadge>
                  )}

                  {listing.amenities.hasElevator && (
                    <AmenityBadge>
                      <ArrowUpDown style={{ width: 14, height: 14 }} />
                      Thang máy
                    </AmenityBadge>
                  )}
                </ListingAmenities>

                <ListingFooter>
                  <FooterItem>
                    <FaClock />
                    {new Date(listing.createdAt).toLocaleDateString("vi-VN")}
                  </FooterItem>

                  <FooterItem>
                    <FaEye />
                    {listing.views || 0} lượt xem
                  </FooterItem>
                </ListingFooter>
              </ListingContent>
            </ListingCard>
          ))}

          {paginatedListings.length > 0 && (
            <Pagination>
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
            </Pagination>
          )}
        </ListingsContainer>

        <Sidebar>
          <SidebarCard>
            <SidebarHeader>
              <FaListAlt style={{ color: "#3498db" }} />
              Thống kê phòng ở ghép
            </SidebarHeader>

            <SidebarContent>
              <StatItem>
                <StatLabel>Tổng số phòng ở ghép:</StatLabel>
                <StatValue>{totalShared} phòng</StatValue>
              </StatItem>

              <StatItem>
                <StatLabel>Phòng có điều hòa:</StatLabel>
                <StatValue>
                  {listings.filter((l) => l.amenities.hasAirConditioner).length}{" "}
                  phòng
                </StatValue>
              </StatItem>

              <StatItem>
                <StatLabel>Phòng có bãi đỗ xe:</StatLabel>
                <StatValue>
                  {listings.filter((l) => l.amenities.hasParking).length} phòng
                </StatValue>
              </StatItem>
            </SidebarContent>
          </SidebarCard>

          {/* Popular Areas */}
          <SidebarCard>
            <SidebarHeader>
              <FaMapMarkerAlt style={{ color: "#f39c12" }} />
              Khu vực phổ biến
            </SidebarHeader>

            <SidebarContent>
              <DistrictTags>
                {districts.slice(0, 8).map((district) => (
                  <DistrictTag
                    key={district}
                    $active={selectedDistrict === district}
                    onClick={() => handleDistrictChange(district)}
                  >
                    {district}
                  </DistrictTag>
                ))}
              </DistrictTags>
            </SidebarContent>
          </SidebarCard>

          {/* Price Range Filter */}
          <SidebarCard>
            <SidebarHeader>
              <FaFilter style={{ color: "#e74c3c" }} />
              Xem theo khoảng giá
            </SidebarHeader>

            <SidebarContent>
              <PriceRangeGrid>
                <PriceRangeButton
                  onClick={() => fetchListingsByPriceRange(0, 1000000)}
                >
                  <PriceRangeArrow>›</PriceRangeArrow> Dưới 1 triệu
                </PriceRangeButton>
                <PriceRangeButton
                  onClick={() => fetchListingsByPriceRange(1000000, 2000000)}
                >
                  <PriceRangeArrow>›</PriceRangeArrow> Từ 1 - 2 triệu
                </PriceRangeButton>
                <PriceRangeButton
                  onClick={() => fetchListingsByPriceRange(2000000, 3000000)}
                >
                  <PriceRangeArrow>›</PriceRangeArrow> Từ 2 - 3 triệu
                </PriceRangeButton>
                <PriceRangeButton
                  onClick={() => fetchListingsByPriceRange(3000000, 5000000)}
                >
                  <PriceRangeArrow>›</PriceRangeArrow> Từ 3 - 5 triệu
                </PriceRangeButton>
                <PriceRangeButton
                  onClick={() => fetchListingsByPriceRange(5000000, 7000000)}
                >
                  <PriceRangeArrow>›</PriceRangeArrow> Từ 5 - 7 triệu
                </PriceRangeButton>
                <PriceRangeButton
                  onClick={() => fetchListingsByPriceRange(7000000, 10000000)}
                >
                  <PriceRangeArrow>›</PriceRangeArrow> Từ 7 - 10 triệu
                </PriceRangeButton>
                <PriceRangeButton
                  onClick={() => fetchListingsByPriceRange(10000000, 15000000)}
                >
                  <PriceRangeArrow>›</PriceRangeArrow> Từ 10 - 15 triệu
                </PriceRangeButton>
                <PriceRangeButton
                  onClick={() =>
                    fetchListingsByPriceRange(15000000, 1000000000)
                  }
                >
                  <PriceRangeArrow>›</PriceRangeArrow> Trên 15 triệu
                </PriceRangeButton>
              </PriceRangeGrid>
            </SidebarContent>
          </SidebarCard>

          <SidebarCard>
            <SidebarHeader>
              <FaClock style={{ color: "#f39c12" }} />
              Tin mới đăng
            </SidebarHeader>

            {recentListings.slice(0, 5).map((listing) => (
              <RecentListingCard
                key={listing._id}
                to={`/listings/${listing._id}`}
              >
                <RecentListingImage
                  src={
                    listing.images[0]?.url ||
                    "/placeholder.svg?height=64&width=80"
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

          {/* Blog Posts */}
          <SidebarCard>
            <SidebarHeader>
              <FaListAlt style={{ color: "#27ae60" }} />
              Bài viết mới
            </SidebarHeader>

            <SidebarContent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {blogs.slice(0, 6).map((blog, index) => (
                  <BlogLink
                    key={blog._id || index}
                    to={`/blog/${blog._id || index}`}
                  >
                    <BlogArrow>›</BlogArrow> {blog.title}
                  </BlogLink>
                ))}
              </div>
            </SidebarContent>
          </SidebarCard>
        </Sidebar>
      </MainContent>
      <FooterSection>
        <FooterTitle>TÌM NGƯỜI Ở GHÉP TẠI RENT-HOUSE.COM</FooterTitle>

        <FooterText>
          Khi có nhu cầu <FooterHighlight>tìm người ở ghép</FooterHighlight>,
          chắc hẳn bạn sẽ băn khoăn với hàng loạt câu hỏi như: "Không biết bắt
          đầu từ đâu? Sợ bị mất cọc oan vì những phòng trọ "dỏm"? Tìm mãi những
          không ra phòng ưng ý?..."
        </FooterText>

        <FooterText>
          Đừng quá lo lắng, vì <FooterHighlight>Rent-house.com</FooterHighlight>{" "}
          chính là giải pháp tối ưu dành cho những vấn đề đó. Nơi bạn có thể{" "}
          <FooterHighlight>tìm người ở ghép</FooterHighlight> mà không cần lận
          lội khắp nơi, chỉ cần vài cú nhấp chuột là tìm thấy ngay một nơi ở
          tiềm năng.
        </FooterText>

        <FooterExpandedContent $expanded={footerExpanded}>
          <FooterText>
            <strong>Giới thiệu về Rent-house.com</strong>
          </FooterText>

          <FooterText>
            <FooterHighlight>
              Rent-house.com là kênh thông tin Phòng trọ số 1 Việt Nam
            </FooterHighlight>
            , một nền tảng chuyên biệt về cho thuê phòng trọ, nhà trọ lớn nhất
            hiện nay. Được ra đời năm 2015 với 10 năm không ngừng phát triển,
            Rent-house.com xây dựng cho mình hơn{" "}
            <FooterHighlight>71.108 tin đăng</FooterHighlight> riêng về phòng
            trọ và trên <FooterHighlight>200.000 tin đăng</FooterHighlight> ở
            tất cả chuyên mục. Tổng lượng user đăng ký tại website là{" "}
            <FooterHighlight>130.000+</FooterHighlight> người trong đó có cả
            chính chủ và môi giới, cùng với hơn{" "}
            <FooterHighlight>3 triệu lượt truy cập mỗi tháng</FooterHighlight>.
            Xứng đáng là cầu nối tốt nhất giữa người thuê và người cho thuê,
            giúp tiết kiệm tối đa thời gian, công sức, và tiền bạc của cả 2 bên.
          </FooterText>

          <FooterText>
            Với Rent-house.com, việc tìm người ở ghép trở nên dễ dàng hơn bao
            giờ hết. Bạn có thể tìm kiếm theo khu vực, mức giá, tiện ích và
            nhiều tiêu chí khác để tìm được người ở ghép phù hợp nhất với nhu
            cầu của mình.
          </FooterText>
        </FooterExpandedContent>

        <FooterExpandButton onClick={toggleFooterExpanded}>
          {footerExpanded ? "Thu gọn" : "Xem thêm"}
        </FooterExpandButton>
      </FooterSection>
    </Container>
  );
}
