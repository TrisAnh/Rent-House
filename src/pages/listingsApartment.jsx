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
  FaChevronUp,
  FaMapMarkerAlt,
  FaFilter,
  FaSearch,
  FaRegBuilding,
  FaListAlt,
  FaHeart,
  FaPhone,
  FaCommentDots,
} from "react-icons/fa";
import { ArrowUpDown } from "lucide-react";

const ITEMS_PER_PAGE = 6;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [totalApartments, setTotalApartments] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [footerExpanded, setFooterExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const district = searchParams.get("district");

  useEffect(() => {
    fetchDistricts();
    fetchRecentListings();
    fetchTotalApartments();
    fetchBlogs();
    if (district) {
      setSelectedDistrict(district);
      fetchListingsByDistrict(district);
    } else {
      fetchAllListings();
    }
  }, [district]);

  // Close district dropdown when clicking outside
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

  const fetchTotalApartments = async () => {
    try {
      const response = await getPostByRoomType("Apartment");
      setTotalApartments((response.data || []).length);
    } catch (err) {
      console.error("Error fetching total apartments:", err);
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

  const fetchListingsByPriceRange = async (priceMin, priceMax) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchPost({ priceMin, priceMax });
      const apartmentListings = (response.data || []).filter(
        (listing) => listing.roomType === "Apartment"
      );
      if (apartmentListings.length === 0) {
        setError(
          `Không tìm thấy căn hộ trong khoảng giá ${priceMin.toLocaleString()} - ${priceMax.toLocaleString()} VND. Vui lòng thử lại với khoảng giá khác.`
        );
        setListings([]);
      } else {
        setListings(apartmentListings);
        setTotalPages(Math.ceil(apartmentListings.length / ITEMS_PER_PAGE));
      }
      setSelectedDistrict("");
      setCurrentPage(1);
      navigate("/apartment");
    } catch (err) {
      console.error(`Error fetching listings for price range:`, err);
      setError(
        `Không thể tải danh sách căn hộ trong khoảng giá. Vui lòng thử lại sau.`
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
      return `Căn hộ tại ${selectedDistrict}`;
    } else {
      return "Tất cả căn hộ";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-sm font-medium text-gray-700">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-sm">
      {/* Hero Header */}
      <div className="bg-white text-black border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3">
              Căn Hộ Cho Thuê tại TP.HCM
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              Tìm kiếm căn hộ với đầy đủ tiện nghi, vị trí thuận lợi và giá cả
              hợp lý
            </p>

            {/* Total Apartments Counter */}
            <div className="bg-white border border-gray-200 rounded-lg py-3 px-6 inline-flex items-center gap-2 mt-2 shadow-sm">
              <FaListAlt className="text-blue-500" />
              <span className="font-bold text-gray-800">
                Tổng số: {totalApartments} căn hộ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDistrictChange("")}
              className={`px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 transition-all ${
                selectedDistrict === ""
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaFilter className="text-xs" /> Tất cả
            </button>

            <div className="relative district-dropdown">
              <button
                onClick={toggleDistrictList}
                className={`px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 transition-all ${
                  selectedDistrict
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaMapMarkerAlt className="text-xs" />
                {selectedDistrict || "Chọn quận"}
                {showDistrictList ? (
                  <FaChevronUp className="ml-1 text-xs" />
                ) : (
                  <FaChevronDown className="ml-1 text-xs" />
                )}
              </button>

              {showDistrictList && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 w-48 max-h-60 overflow-y-auto z-50">
                  {districts.map((district) => (
                    <button
                      key={district}
                      onClick={() => handleDistrictChange(district)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${
                        selectedDistrict === district
                          ? "bg-amber-50 text-amber-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative flex-grow ml-auto max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-xs" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, địa chỉ..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-4 w-4 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-red-700 text-xs">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Category Header */}
            {!loading && !error && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center">
                    <FaRegBuilding />
                  </div>
                  <h2 className="text-base font-bold text-gray-800">
                    {getCategoryTitle()}
                  </h2>
                </div>
                <div className="text-xs font-medium text-blue-600">
                  {filteredListings.length} kết quả
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && paginatedListings.length === 0 && !error && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <FaSearch className="mx-auto text-3xl text-gray-300 mb-3" />
                <p className="text-sm text-gray-700">
                  Không tìm thấy kết quả phù hợp
                </p>
              </div>
            )}

            {/* Listings Grid */}
            <div className="space-y-3">
              {paginatedListings.map((listing) => {
                const {
                  _id,
                  title,
                  location,
                  price,
                  size,
                  amenities,
                  images,
                  views,
                  createdAt,
                } = listing;
                return (
                  <Link
                    key={_id}
                    to={`/listings/${_id}`}
                    className="block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md hover:border-gray-300 group"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative md:w-2/5">
                        <div className="aspect-w-4 aspect-h-3 md:h-full">
                          <img
                            src={
                              images[0]?.url ||
                              "/placeholder.svg?height=240&width=320" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded-md backdrop-blur-sm">
                          Căn hộ
                        </div>
                        <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center transition-all hover:bg-white group-hover:scale-110">
                          <FaHeart className="text-gray-400 group-hover:text-red-500 text-xs" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-3 flex flex-col flex-grow md:w-3/5">
                        <h3 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {title}
                        </h3>

                        <div className="flex items-start gap-1.5 mb-1 text-gray-600 text-xs">
                          <FaMapMarkerAlt className="text-amber-500 mt-0.5 flex-shrink-0 text-xs" />
                          <span className="line-clamp-1">
                            {location.address}, {location.district}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-red-600 mb-2">
                          {price.toLocaleString()} VND/tháng
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-auto">
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            <FaRulerCombined className="text-xs" />
                            <span>{size} m²</span>
                          </div>

                          {amenities.hasWifi && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                              <FaWifi className="text-xs" />
                              <span>Wifi</span>
                            </div>
                          )}

                          {amenities.hasParking && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-xs font-medium">
                              <FaParking className="text-xs" />
                              <span>Bãi đỗ xe</span>
                            </div>
                          )}

                          {amenities.hasAirConditioner && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-xs font-medium">
                              <FaSnowflake className="text-xs" />
                              <span>Điều hòa</span>
                            </div>
                          )}

                          {amenities.hasKitchen && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-xs font-medium">
                              <FaUtensils className="text-xs" />
                              <span>Nhà bếp</span>
                            </div>
                          )}

                          {amenities.hasElevator && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium">
                              <ArrowUpDown className="h-3 w-3" />
                              <span>Thang máy</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaEye className="text-gray-400 text-xs" />
                            <span>{views || 0} lượt xem</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <FaClock className="text-gray-400 text-xs" />
                            <span>
                              {new Date(createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {paginatedListings.length > 0 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Trang trước
                </button>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-4">
            {/* Total Apartments Stats */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <FaListAlt className="text-blue-600 text-xs" />
                  <h3 className="text-sm font-bold text-gray-800">
                    Thống kê căn hộ
                  </h3>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">Tổng số căn hộ:</span>
                  <span className="text-sm font-bold text-blue-600">
                    {totalApartments} căn hộ
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">
                    Căn hộ có điều hòa:
                  </span>
                  <span className="text-sm font-bold text-purple-600">
                    {
                      listings.filter((l) => l.amenities.hasAirConditioner)
                        .length
                    }{" "}
                    căn hộ
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Căn hộ có bãi đỗ xe:
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {listings.filter((l) => l.amenities.hasParking).length} căn
                    hộ
                  </span>
                </div>
              </div>
            </div>

            {/* Popular Areas */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-amber-600 text-xs" />
                  <h3 className="text-sm font-bold text-gray-800">
                    Khu vực phổ biến
                  </h3>
                </div>
              </div>

              <div className="p-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Quận 1",
                    "Quận 2",
                    "Quận 3",
                    "Quận 7",
                    "Quận Bình Thạnh",
                    "Quận Cầu Giấy",
                    "Quận Thủ Đức",
                  ].map((district) => (
                    <button
                      key={district}
                      onClick={() => handleDistrictChange(district)}
                      className="px-3 py-1.5 bg-gray-100 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <FaFilter className="text-red-600 text-xs" />
                  <h3 className="text-sm font-bold text-gray-800">
                    Xem theo khoảng giá
                  </h3>
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => fetchListingsByPriceRange(0, 1000000)}
                    className="text-left flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <span className="text-red-500">›</span> Dưới 1 triệu
                  </button>
                  <button
                    onClick={() => fetchListingsByPriceRange(1000000, 2000000)}
                    className="text-left flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <span className="text-red-500">›</span> Từ 1 - 2 triệu
                  </button>
                  <button
                    onClick={() => fetchListingsByPriceRange(2000000, 3000000)}
                    className="text-left flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <span className="text-red-500">›</span> Từ 2 - 3 triệu
                  </button>
                  <button
                    onClick={() => fetchListingsByPriceRange(3000000, 5000000)}
                    className="text-left flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <span className="text-red-500">›</span> Từ 3 - 5 triệu
                  </button>
                  <button
                    onClick={() => fetchListingsByPriceRange(5000000, 7000000)}
                    className="text-left flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <span className="text-red-500">›</span> Từ 5 - 7 triệu
                  </button>
                  <button
                    onClick={() => fetchListingsByPriceRange(7000000, 10000000)}
                    className="text-left flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <span className="text-red-500">›</span> Từ 7 - 10 triệu
                  </button>
                  <button
                    onClick={() =>
                      fetchListingsByPriceRange(10000000, 15000000)
                    }
                    className="text-left flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <span className="text-red-500">›</span> Từ 10 - 15 triệu
                  </button>
                  <button
                    onClick={() =>
                      fetchListingsByPriceRange(15000000, 1000000000)
                    }
                    className="text-left flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <span className="text-red-500">›</span> Trên 15 triệu
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Listings */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <FaClock className="text-amber-600 text-xs" />
                  <h3 className="text-sm font-bold text-gray-800">
                    Tin mới đăng
                  </h3>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {recentListings.slice(0, 5).map((listing) => (
                  <Link
                    key={listing._id}
                    to={`/listings/${listing._id}`}
                    className="flex gap-2 p-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-12 flex-shrink-0 rounded-md overflow-hidden">
                      <img
                        src={
                          listing.images[0]?.url ||
                          "/placeholder.svg?height=64&width=80" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-xs mb-0.5 truncate">
                        {listing.title}
                      </h4>
                      <div className="text-red-600 font-bold text-xs mb-0.5">
                        {listing.price.toLocaleString()} VND/tháng
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-0.5 text-[10px]">
                          <FaClock className="text-amber-500 text-[10px]" />
                          {new Date(listing.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px]">
                          <FaEye className="text-gray-400 text-[10px]" />
                          {listing.views || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Blog Posts */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <FaListAlt className="text-green-600 text-sm" />
                  <h3 className="text-base font-bold text-gray-800">
                    Bài viết mới
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <div className="grid gap-3">
                  {blogs.slice(0, 6).map((blog, index) => (
                    <Link
                      key={blog._id || index}
                      to={`/blog/${blog._id || index}`}
                      className="text-left flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <span className="text-red-500 text-base">›</span>{" "}
                      {blog.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-12 p-8 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
          CHO THUÊ CĂN HỘ TẠI RENT-HOUSE.COM
        </h2>

        <div className="space-y-4">
          <p className="text-gray-700 text-sm md:text-base">
            Khi có nhu cầu{" "}
            <span className="font-semibold text-blue-600">căn hộ</span>, chắc
            hẳn bạn sẽ băn khoăn với hàng loạt câu hỏi như: "
            <i>
              Không biết bắt đầu từ đâu? Sợ bị mất cọc oan vì những căn hộ
              "dỏm"? Tìm mãi những không ra phòng ưng ý?...
            </i>
            "
          </p>

          <p className="text-gray-700 text-sm md:text-base">
            Đừng quá lo lắng, vì{" "}
            <span className="font-semibold text-blue-600">Rent-house.com</span>{" "}
            chính là giải pháp tối ưu dành cho những vấn đề đó. Nơi bạn có thể{" "}
            <span className="font-semibold text-blue-600">tìm căn hộ</span> mà
            không cần lận lội khắp nơi, chỉ cần vài cú nhấp chuột là tìm thấy
            ngay một nơi ở tiềm năng.
          </p>
        </div>

        {/* Expandable Content */}
        <div
          className={`mt-4 pt-4 border-t border-gray-200 ${
            !footerExpanded ? "hidden" : ""
          }`}
        >
          <div className="space-y-4">
            <p className="text-gray-700 font-semibold text-sm md:text-base">
              Giới thiệu về Rent-house.com
            </p>

            <p className="text-gray-700 text-sm md:text-base">
              <span className="font-semibold text-blue-600">
                Rent-house.com là kênh thông tin Phòng trọ số 1 Việt Nam
              </span>
              , một nền tảng chuyên biệt về cho thuê phòng trọ, nhà trọ lớn nhất
              hiện nay. Được ra đời năm 2015 với 10 năm không ngừng phát triển,
              Rent-house.com xây dựng cho mình hơn{" "}
              <span className="font-semibold text-blue-600">
                71.108 tin đăng
              </span>{" "}
              riêng về phòng trọ và trên{" "}
              <span className="font-semibold text-blue-600">
                200.000 tin đăng
              </span>{" "}
              ở tất cả chuyên mục. Tổng lượng user đăng ký tại website là{" "}
              <span className="font-semibold text-blue-600">130.000+</span>{" "}
              người trong đó có cả chính chủ và môi giới, cùng với hơn{" "}
              <span className="font-semibold text-blue-600">
                3 triệu lượt truy cập mỗi tháng
              </span>
              . Xứng đáng là cầu nối tốt nhất giữa người thuê và người cho thuê,
              giúp tiết kiệm tối đa thời gian, công sức, và tiền bạc của cả 2
              bên.
            </p>

            <p className="text-gray-700 text-sm md:text-base">
              Với Rent-house.com, việc tìm phòng trọ trở nên dễ dàng hơn bao giờ
              hết. Bạn có thể tìm kiếm theo khu vực, mức giá, tiện ích và nhiều
              tiêu chí khác để tìm được phòng trọ phù hợp nhất với nhu cầu của
              mình.
            </p>
          </div>
        </div>

        <button
          onClick={() => setFooterExpanded(!footerExpanded)}
          className="mt-4 mx-auto block px-6 py-2 bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium rounded-md transition-colors"
        >
          {footerExpanded ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>
      {/* Customer Support Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-6">
              <img
                src="/assets/customer_service.jpg"
                alt="Customer support representative"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Hỗ trợ chủ nhà đăng tin
              </h2>
              <p className="text-gray-600 mb-6">
                Nếu bạn cần hỗ trợ đăng tin, vui lòng liên hệ số điện thoại bên
                dưới:
              </p>

              <div className="space-y-4">
                <a
                  href="tel:0909316890"
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md transition-colors font-medium"
                >
                  <FaPhone className="h-5 w-5" />
                  ĐT: 0364745239
                </a>

                <a
                  href="https://zalo.me/0364745239"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors font-medium"
                >
                  <FaCommentDots className="h-5 w-5" />
                  Zalo: 0364745239
                </a>

                <p className="text-gray-600 mt-6 mb-3 text-center">
                  Hỗ trợ ngoài giờ
                </p>

                <a
                  href="https://zalo.me/renthouse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors font-medium"
                >
                  <FaCommentDots className="h-5 w-5" />
                  Zalo: renthouse
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
