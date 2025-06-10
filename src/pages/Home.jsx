"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaStar,
  FaRegStar,
  FaHeart,
  FaFilter,
} from "react-icons/fa";
import {
  searchPost,
  getRoomTypes,
  getPostByRoomType,
  getTopViewedPosts,
  getDistricts,
  getAllPosts,
} from "../api/post";

import GeminiChatBox from "./ChatBoxGemini";

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingTopViews, setLoadingTopViews] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchParams, setSearchParams] = useState({
    title: "",
    location: "",
    district: "",
    ward: "",
    city: "",
    roomType: "",
    priceMin: "",
    priceMax: "",
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [postsByRoomType, setPostsByRoomType] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const navigate = useNavigate();
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingTopViews(true);
      try {
        const [
          activePostsResponse,
          roomTypesResponse,
          topViewedResponse,
          districtsResponse,
        ] = await Promise.all([
          getAllPosts(),
          getRoomTypes(),
          getTopViewedPosts(),
          getDistricts(),
        ]);

        setFeaturedProperties(activePostsResponse?.data || []);
        setRoomTypes(roomTypesResponse?.data || []);
        setTopViewedPosts(topViewedResponse?.data || []);
        setDistricts(districtsResponse?.data || []);

        const postsByType = {};
        const initialCurrentPage = {};
        for (const type of roomTypesResponse?.data || []) {
          const response = await getPostByRoomType(type);
          postsByType[type] = response?.data || [];
          initialCurrentPage[type] = 0;
        }
        setPostsByRoomType(postsByType);
        setCurrentPage({ ...initialCurrentPage, recentlyUpdated: 0 });
      } catch (err) {
        setErrors({
          general: err.message || "An error occurred while fetching data",
        });
      } finally {
        setLoadingTopViews(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    // Clear the error for this field when the user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const validateSearchParams = () => {
    const newErrors = {};
    if (searchParams.priceMin && Number(searchParams.priceMin) < 0) {
      newErrors.priceMin = "Giá tối thiểu không được âm";
    }
    if (searchParams.priceMax && Number(searchParams.priceMax) < 0) {
      newErrors.priceMax = "Giá tối đa không được âm";
    }
    if (
      searchParams.priceMin &&
      searchParams.priceMax &&
      Number(searchParams.priceMin) > Number(searchParams.priceMax)
    ) {
      newErrors.priceMin = "Giá tối thiểu không được lớn hơn giá tối đa";
      newErrors.priceMax = "Giá tối đa không được nhỏ hơn giá tối thiểu";
    }
    if (searchParams.priceMin && Number(searchParams.priceMin) > 1000000000) {
      newErrors.priceMin = "Giá tối thiểu quá lớn";
    }
    if (searchParams.priceMax && Number(searchParams.priceMax) > 1000000000) {
      newErrors.priceMax = "Giá tối đa quá lớn";
    }
    return newErrors;
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateSearchParams();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoadingSearch(true);
      setShowSearchResults(false);
      try {
        const response = await searchPost({
          title: searchParams.title,
          location: searchParams.location,
          district: searchParams.district,
          ward: searchParams.ward,
          city: searchParams.city,
          roomType: searchParams.roomType,
          priceMin: searchParams.priceMin
            ? Number(searchParams.priceMin)
            : undefined,
          priceMax: searchParams.priceMax
            ? Number(searchParams.priceMax)
            : undefined,
        });
        setSearchResults(Array.isArray(response?.data) ? response.data : []);
        setShowSearchResults(true);
        console.log("Kết quả tìm kiếm:", response.data);
        setMobileFilterOpen(false);
      } catch (error) {
        console.error("Search error:", error);
        setErrors({
          general: "Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.",
        });
      } finally {
        setLoadingSearch(false);
      }
    }
  };

  const handlePrevPage = (roomType) => {
    setCurrentPage((prev) => ({
      ...prev,
      [roomType]: Math.max(0, prev[roomType] - 1),
    }));
  };

  const handleNextPage = (roomType) => {
    setCurrentPage((prev) => ({
      ...prev,
      [roomType]: prev[roomType] + 1,
    }));
  };

  if (loadingTopViews) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-semibold text-blue-600">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  if (errors.general) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Đã xảy ra lỗi
          </h2>
          <p className="text-gray-700 mb-6">{errors.general}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const renderPropertyCards = (properties, roomType) => {
    const startIndex = currentPage[roomType] * 4;
    const visibleProperties = properties.slice(startIndex, startIndex + 4);

    if (visibleProperties.length === 0) {
      return (
        <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg">Không có dữ liệu để hiển thị</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {visibleProperties.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl w-full"
          >
            <Link to={`/listings/${property._id}`}>
              <div className="relative">
                <img
                  src={
                    property.images?.[0]?.url ||
                    "/placeholder.svg?height=240&width=400" ||
                    "/placeholder.svg"
                  }
                  alt={property.title}
                  className="w-full h-48 sm:h-52 object-cover"
                />
                <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start">
                  {topViewedPosts.some((post) => post._id === property._id) && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Hot
                    </span>
                  )}
                  <button className="bg-white bg-opacity-80 p-1.5 rounded-full text-red-500 hover:bg-opacity-100 transition-all ml-auto">
                    <FaHeart className="w-4 h-4" />
                  </button>
                </div>
                {property.roomType && (
                  <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                    {property.roomType}
                  </span>
                )}
              </div>
            </Link>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2 h-14">
                {property.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 flex items-start">
                <FaMapMarkerAlt className="mr-1 text-blue-500 mt-1 flex-shrink-0" />
                <span className="line-clamp-2 h-10">
                  {property.location?.address}, {property.location?.ward},{" "}
                  {property.location?.district}, {property.location?.city}
                </span>
              </p>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xl font-bold text-blue-600">
                  {property.price?.toLocaleString()} đ
                </p>
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.round(property.averageRating || 0) ? (
                        <FaStar className="w-4 h-4" />
                      ) : (
                        <FaRegStar className="w-4 h-4" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDistrictDropdown = (roomType) => (
    <div className="mb-6">
      <details className="bg-white rounded-lg shadow-md">
        <summary className="cursor-pointer p-3 sm:p-4 font-semibold text-blue-600 hover:bg-blue-50 transition-colors duration-300 flex justify-between items-center">
          <span>Chọn quận</span>
          <FaChevronDown className="text-blue-600" />
        </summary>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {districts.map((district) => (
            <button
              key={district}
              onClick={() => {
                if (roomType === "Single" || roomType === "Double") {
                  navigate(
                    `/listings?district=${encodeURIComponent(district)}`
                  );
                } else {
                  navigate(
                    `/${roomType.toLowerCase()}?district=${encodeURIComponent(
                      district
                    )}`
                  );
                }
              }}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm transition duration-300 truncate"
            >
              {district}
            </button>
          ))}
        </div>
      </details>
    </div>
  );

  const renderViewMoreLink = (roomType) => {
    let linkTo = "/listings";
    const linkText = `Xem thêm ${roomType.toLowerCase()} khác`;

    if (roomType === "Single" || roomType === "Double") {
      linkTo = "/listings";
    } else if (roomType === "Shared") {
      linkTo = "/shared";
    } else {
      linkTo = `/${roomType.toLowerCase().replace(" ", "-")}`;
    }

    return (
      <Link
        to={linkTo}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base transition duration-300 font-medium"
      >
        {linkText}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Filter Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
          aria-label="Filter"
        >
          <FaFilter size={20} />
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-white z-40 p-4 pt-16 overflow-y-auto md:hidden">
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="absolute top-4 right-4 text-gray-600 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <FaTimes size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">
            Tìm kiếm
          </h2>
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                placeholder="Nhập địa chỉ cần tìm"
                name="location"
                value={searchParams.location}
                onChange={handleSearchChange}
                className={`w-full p-3 rounded-lg border ${
                  errors.location ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại phòng
              </label>
              <select
                name="roomType"
                value={searchParams.roomType}
                onChange={handleSearchChange}
                className={`w-full p-3 rounded-lg border ${
                  errors.roomType ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
              >
                <option value="">Tất cả loại phòng</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.roomType && (
                <p className="text-red-500 text-xs mt-1">{errors.roomType}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá tối thiểu
                </label>
                <input
                  type="number"
                  placeholder="VNĐ"
                  name="priceMin"
                  value={searchParams.priceMin}
                  onChange={handleSearchChange}
                  className={`w-full p-3 rounded-lg border ${
                    errors.priceMin ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                />
                {errors.priceMin && (
                  <p className="text-red-500 text-xs mt-1">{errors.priceMin}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá tối đa
                </label>
                <input
                  type="number"
                  placeholder="VNĐ"
                  name="priceMax"
                  value={searchParams.priceMax}
                  onChange={handleSearchChange}
                  className={`w-full p-3 rounded-lg border ${
                    errors.priceMax ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                />
                {errors.priceMax && (
                  <p className="text-red-500 text-xs mt-1">{errors.priceMax}</p>
                )}
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                {isAdvancedSearch
                  ? "Ẩn tìm kiếm nâng cao"
                  : "Tìm kiếm nâng cao"}
                <FaChevronDown
                  className={`ml-1 transform transition-transform ${
                    isAdvancedSearch ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {isAdvancedSearch && (
              <div className="space-y-4 pt-2 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập từ khóa"
                    name="title"
                    value={searchParams.title}
                    onChange={handleSearchChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập quận"
                    name="district"
                    value={searchParams.district}
                    onChange={handleSearchChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.district ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                  />
                  {errors.district && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập phường"
                    name="ward"
                    value={searchParams.ward}
                    onChange={handleSearchChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.ward ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                  />
                  {errors.ward && (
                    <p className="text-red-500 text-xs mt-1">{errors.ward}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập thành phố"
                    name="city"
                    value={searchParams.city}
                    onChange={handleSearchChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition duration-300 font-medium mt-6"
            >
              <FaSearch className="mr-2" /> Tìm kiếm
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-95 z-40 p-4 pt-16 overflow-y-auto md:hidden">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-blue-800"
            aria-label="Close"
          >
            <FaTimes size={24} />
          </button>
          <div className="flex flex-col space-y-6 text-white">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Rent-House.com</h2>
              <p className="text-blue-300 mt-1">
                Kênh thông tin phòng trọ số 1 Việt Nam
              </p>
            </div>
            <Link
              to="/"
              className="text-xl py-3 border-b border-blue-700 hover:bg-blue-800 px-4 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            {roomTypes.map((type) => (
              <Link
                key={type}
                to={`/${type.toLowerCase().replace(" ", "-")}`}
                className="text-xl py-3 border-b border-blue-700 hover:bg-blue-800 px-4 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {type}
              </Link>
            ))}
            <Link
              to="/contact"
              className="text-xl py-3 border-b border-blue-700 hover:bg-blue-800 px-4 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Liên hệ
            </Link>
            <div className="pt-4 mt-4 bg-blue-800 p-4 rounded-xl">
              <p className="flex items-center text-xl justify-center">
                <FaPhoneAlt className="mr-3" /> Hotline: 0123 456 789
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 pt-16 md:pt-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-blue-900 leading-tight">
            Chào mừng đến với Rent-House.com
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-700">
            Kênh thông tin phòng trọ số 1 Việt Nam
          </p>
        </header>

        {/* Search Form - Collapsible on mobile */}
        <div className="mb-8">
          <div className="md:hidden">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition duration-300 font-medium"
            >
              <FaSearch className="mr-2" /> Tìm kiếm phòng trọ
            </button>
          </div>

          {/* Desktop Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:block bg-white p-6 rounded-2xl shadow-xl border border-blue-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ cần tìm"
                  name="location"
                  value={searchParams.location}
                  onChange={handleSearchChange}
                  className={`w-full p-3 rounded-lg border ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại phòng
                </label>
                <select
                  name="roomType"
                  value={searchParams.roomType}
                  onChange={handleSearchChange}
                  className={`w-full p-3 rounded-lg border ${
                    errors.roomType ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                >
                  <option value="">Tất cả loại phòng</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.roomType && (
                  <p className="text-red-500 text-xs mt-1">{errors.roomType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá tối thiểu
                </label>
                <input
                  type="number"
                  placeholder="VNĐ"
                  name="priceMin"
                  value={searchParams.priceMin}
                  onChange={handleSearchChange}
                  className={`w-full p-3 rounded-lg border ${
                    errors.priceMin ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                />
                {errors.priceMin && (
                  <p className="text-red-500 text-xs mt-1">{errors.priceMin}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá tối đa
                </label>
                <input
                  type="number"
                  placeholder="VNĐ"
                  name="priceMax"
                  value={searchParams.priceMax}
                  onChange={handleSearchChange}
                  className={`w-full p-3 rounded-lg border ${
                    errors.priceMax ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                />
                {errors.priceMax && (
                  <p className="text-red-500 text-xs mt-1">{errors.priceMax}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                {isAdvancedSearch
                  ? "Ẩn tìm kiếm nâng cao"
                  : "Tìm kiếm nâng cao"}
                <FaChevronDown
                  className={`ml-1 transform transition-transform ${
                    isAdvancedSearch ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition duration-300 font-medium"
              >
                <FaSearch className="mr-2" /> Tìm kiếm
              </button>
            </div>
            {isAdvancedSearch && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập từ khóa"
                    name="title"
                    value={searchParams.title}
                    onChange={handleSearchChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập quận"
                    name="district"
                    value={searchParams.district}
                    onChange={handleSearchChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.district ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                  />
                  {errors.district && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập phường"
                    name="ward"
                    value={searchParams.ward}
                    onChange={handleSearchChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.ward ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                  />
                  {errors.ward && (
                    <p className="text-red-500 text-xs mt-1">{errors.ward}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập thành phố"
                    name="city"
                    value={searchParams.city}
                    onChange={handleSearchChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {loadingSearch ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl sm:text-2xl text-blue-600">
              Đang tìm kiếm...
            </p>
          </div>
        ) : showSearchResults ? (
          <section className="mb-12 sm:mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
                Kết quả tìm kiếm
              </h2>
              <span className="text-gray-500 text-sm">
                Tìm thấy {searchResults.length} kết quả
              </span>
            </div>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {searchResults.map((property) => (
                  <div
                    key={property._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl w-full"
                  >
                    <Link to={`/listings/${property._id}`}>
                      <div className="relative">
                        <img
                          src={
                            property.images?.[0]?.url ||
                            "/placeholder.svg?height=240&width=400" ||
                            "/placeholder.svg"
                          }
                          alt={property.title}
                          className="w-full h-48 sm:h-52 object-cover"
                        />
                        <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start">
                          {topViewedPosts.some(
                            (post) => post._id === property._id
                          ) && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Hot
                            </span>
                          )}
                          <button className="bg-white bg-opacity-80 p-1.5 rounded-full text-red-500 hover:bg-opacity-100 transition-all ml-auto">
                            <FaHeart className="w-4 h-4" />
                          </button>
                        </div>
                        {property.roomType && (
                          <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                            {property.roomType}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2 h-14">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 flex items-start">
                        <FaMapMarkerAlt className="mr-1 text-blue-500 mt-1 flex-shrink-0" />
                        <span className="line-clamp-2 h-10">
                          {property.location?.district},{" "}
                          {property.location?.city}
                        </span>
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xl font-bold text-blue-600">
                          {property.price?.toLocaleString()} đ
                        </p>
                        <div className="flex items-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.round(property.averageRating || 0) ? (
                                <FaStar className="w-4 h-4" />
                              ) : (
                                <FaRegStar className="w-4 h-4" />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <div className="text-gray-400 text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Không tìm thấy kết quả phù hợp
                </h3>
                <p className="text-gray-500 mb-6">
                  Vui lòng thử lại với các tiêu chí tìm kiếm khác
                </p>
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg md:hidden transition duration-300"
                >
                  Thay đổi bộ lọc
                </button>
              </div>
            )}
          </section>
        ) : null}

        {/* Main Content - Stacked vertically on all screen sizes */}
        <div className="space-y-12">
          {/* Recently Updated Properties */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4 sm:mb-0">
                Tin đăng mới cập nhật
              </h2>
              <div className="flex gap-2 sm:gap-4 self-end sm:self-auto">
                <button
                  onClick={() => handlePrevPage("recentlyUpdated")}
                  disabled={currentPage["recentlyUpdated"] === 0}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 sm:px-4 py-2 rounded-lg transition duration-300 disabled:opacity-50 text-sm sm:text-base flex items-center"
                >
                  <FaChevronLeft className="mr-1 sm:mr-2" /> Trước
                </button>
                <button
                  onClick={() => handleNextPage("recentlyUpdated")}
                  disabled={
                    (currentPage["recentlyUpdated"] + 1) * 4 >=
                    featuredProperties.length
                  }
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 sm:px-4 py-2 rounded-lg transition duration-300 disabled:opacity-50 text-sm sm:text-base flex items-center"
                >
                  Tiếp <FaChevronRight className="ml-1 sm:ml-2" />
                </button>
              </div>
            </div>
            {renderPropertyCards(featuredProperties, "recentlyUpdated")}
          </section>

          {/* Room Type Sections */}
          {roomTypes.map((roomType) => (
            <section key={roomType}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-900 flex items-center">
                <span className="mr-2">{roomType}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {postsByRoomType[roomType]?.length || 0} phòng
                </span>
              </h2>
              {renderDistrictDropdown(roomType)}
              {renderPropertyCards(postsByRoomType[roomType] || [], roomType)}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 gap-4">
                <button
                  onClick={() => handlePrevPage(roomType)}
                  disabled={currentPage[roomType] === 0}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition duration-300 disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto flex items-center justify-center"
                >
                  <FaChevronLeft className="mr-2" /> Trang trước
                </button>

                {renderViewMoreLink(roomType)}
                <button
                  onClick={() => handleNextPage(roomType)}
                  disabled={
                    (currentPage[roomType] + 1) * 4 >=
                    (postsByRoomType[roomType]?.length || 0)
                  }
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition duration-300 disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto flex items-center justify-center"
                >
                  Trang tiếp <FaChevronRight className="ml-2" />
                </button>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 sm:mt-16 text-center bg-blue-900 text-white p-6 sm:p-12 rounded-xl sm:rounded-2xl shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Liên hệ với chúng tôi
          </h2>
          <p className="flex items-center justify-center text-xl sm:text-2xl mb-4">
            <FaPhoneAlt className="mr-2 sm:mr-3" /> Hotline: 0123 456 789
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-left max-w-4xl mx-auto">
            <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-lg">Trụ sở chính</h3>
              <p className="text-blue-100">
                123 Đường ABC, Quận 1, TP. Hồ Chí Minh
              </p>
            </div>
            <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-lg">Giờ làm việc</h3>
              <p className="text-blue-100">
                Thứ 2 - Thứ 6: 8:00 - 17:30
                <br />
                Thứ 7: 8:00 - 12:00
              </p>
            </div>
            <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-lg">Email</h3>
              <p className="text-blue-100">
                info@renthouse.com
                <br />
                support@renthouse.com
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
