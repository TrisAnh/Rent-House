import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  getPostActive,
  searchPost,
  getRoomTypes,
  getPostByRoomType,
  getTopViewedPosts,
  getDistricts,
} from "../api/post";

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingTopViews, setLoadingTopViews] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    title: "",
    location: "",
    roomType: "",
    priceMin: "",
    priceMax: "",
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [postsByRoomType, setPostsByRoomType] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const navigate = useNavigate();
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
          getPostActive(),
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
        for (let type of roomTypesResponse?.data || []) {
          const response = await getPostByRoomType(type);
          postsByType[type] = response?.data || [];
          initialCurrentPage[type] = 0;
        }
        setPostsByRoomType(postsByType);
        setCurrentPage({ ...initialCurrentPage, recentlyUpdated: 0 });
      } catch (err) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoadingTopViews(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoadingSearch(true);
    try {
      const response = await searchPost(searchParams);
      setSearchResults(response?.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
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
      <div className="flex items-center justify-center h-screen text-2xl font-semibold text-blue-600">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold text-red-600">
        Lỗi: {error}
      </div>
    );
  }

  const renderPropertyCards = (properties, roomType) => {
    const startIndex = currentPage[roomType] * 4;
    return properties.slice(startIndex, startIndex + 4).map((property) => (
      <div
        key={property._id}
        className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 w-full"
      >
        <Link to={`/listings/${property._id}`}>
          <div className="relative">
            <img
              src={property.images[0]?.url || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-60 object-cover"
            />
            {topViewedPosts.some((post) => post._id === property._id) && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Hot
              </span>
            )}
          </div>
        </Link>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2 text-gray-800 truncate">
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <FaMapMarkerAlt className="mr-1 text-blue-500" />
            {property.location?.district}, Hồ Chí Minh
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-2">
            {property.price?.toLocaleString()} đ/tháng
          </p>
          <div className="flex items-center text-sm text-yellow-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(property.averageRating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  const renderDistrictButtons = (roomType) => (
    <div className="flex flex-wrap gap-2 mb-6">
      {districts.map((district) => (
        <button
          key={district}
          onClick={() => {
            if (roomType === "Single" || roomType === "Double") {
              navigate(`/listings?district=${encodeURIComponent(district)}`);
            } else {
              navigate(
                `/${roomType.toLowerCase()}?district=${encodeURIComponent(
                  district
                )}`
              );
            }
          }}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm transition duration-300"
        >
          {district}
        </button>
      ))}
    </div>
  );
  const renderViewMoreLink = (roomType) => {
    let linkTo = "/listings";
    let linkText = `Xem thêm ${roomType.toLowerCase()} khác →`;

    if (roomType === "Single" || roomType === "Double") {
      // linkTo = `/listings?roomType=${roomType.toLowerCase()}`;
      linkTo = "/listings";
    } else if (roomType === "Shared") {
      linkTo = "/shared";
    } else {
      linkTo = `/${roomType.toLowerCase().replace(" ", "-")}`;
    }

    return (
      <Link
        to={linkTo}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition duration-300"
      >
        {linkText}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-blue-900">
            Chào mừng đến với Rent-House.com
          </h1>
          <p className="text-2xl text-blue-700">
            Kênh thông tin phòng trọ số 1 Việt Nam
          </p>
        </header>

        <form
          onSubmit={handleSearchSubmit}
          className="mb-12 bg-white p-8 rounded-2xl shadow-xl border border-blue-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              name="title"
              value={searchParams.title}
              onChange={handleSearchChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Địa điểm"
              name="location"
              value={searchParams.location}
              onChange={handleSearchChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="roomType"
              value={searchParams.roomType}
              onChange={handleSearchChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Loại phòng</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-6">
            <input
              type="number"
              placeholder="Giá tối thiểu"
              name="priceMin"
              value={searchParams.priceMin}
              onChange={handleSearchChange}
              className="border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Giá tối đa"
              name="priceMax"
              value={searchParams.priceMax}
              onChange={handleSearchChange}
              className="border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center flex-1 transition duration-300"
            >
              <FaSearch className="mr-2" /> Tìm kiếm
            </button>
          </div>
        </form>

        {loadingSearch ? (
          <div className="text-center py-12 text-2xl text-blue-600">
            Đang tìm kiếm...
          </div>
        ) : searchResults.length > 0 ? (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">
              Kết quả tìm kiếm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {renderPropertyCards(searchResults, "search")}
            </div>
          </section>
        ) : null}

        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-900">
              Tin đăng mới cập nhật
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => handlePrevPage("recentlyUpdated")}
                disabled={currentPage["recentlyUpdated"] === 0}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full transition duration-300 disabled:opacity-50"
              >
                <FaChevronLeft className="inline mr-2" /> Trước
              </button>
              <button
                onClick={() => handleNextPage("recentlyUpdated")}
                disabled={
                  (currentPage["recentlyUpdated"] + 1) * 4 >=
                  featuredProperties.length
                }
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full transition duration-300 disabled:opacity-50"
              >
                Tiếp <FaChevronRight className="inline ml-2" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderPropertyCards(featuredProperties, "recentlyUpdated")}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/tin-moi"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition duration-300"
            >
              Xem tất cả tin mới →
            </Link>
          </div>
        </section>

        {roomTypes.map((roomType) => (
          <section key={roomType} className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">
              {roomType}
            </h2>
            {renderDistrictButtons(roomType)}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {renderPropertyCards(postsByRoomType[roomType] || [], roomType)}
            </div>
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => handlePrevPage(roomType)}
                disabled={currentPage[roomType] === 0}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full transition duration-300 disabled:opacity-50"
              >
                <FaChevronLeft className="inline mr-2" /> Trước
              </button>

              {renderViewMoreLink(roomType)}
              <button
                onClick={() => handleNextPage(roomType)}
                disabled={
                  (currentPage[roomType] + 1) * 4 >=
                  (postsByRoomType[roomType]?.length || 0)
                }
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full transition duration-300 disabled:opacity-50"
              >
                Tiếp <FaChevronRight className="inline ml-2" />
              </button>
            </div>
          </section>
        ))}

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-blue-900">
            Chia sẻ mẹo hay và kinh nghiệm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-bold text-2xl mb-4 text-blue-900">
                Mẫu hợp đồng cho thuê phòng trọ, nhà trọ chuẩn chính nhất năm
                2024
              </h3>
              <p className="text-gray-600 mb-4">
                Tổng hợp các mẫu hợp đồng cho thuê phòng trọ, nhà trọ...
              </p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
              >
                Đọc thêm →
              </a>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-bold text-2xl mb-4 text-blue-900">
                Kinh nghiệm thuê phòng trọ cho Sinh Viên
              </h3>
              <p className="text-gray-600 mb-4">
                Những điều cần lưu ý khi thuê phòng trọ dành cho sinh viên...
              </p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
              >
                Đọc thêm →
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center bg-blue-900 text-white p-12 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h2>
          <p className="flex items-center justify-center text-2xl">
            <FaPhoneAlt className="mr-3" /> Hotline: 0123 456 789
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
