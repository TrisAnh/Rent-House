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
  FaElevator,
} from "react-icons/fa";

const ITEMS_PER_PAGE = 9;

export default function SharedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  };

  const paginatedListings = listings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
        Tìm Người Ở Ghép tại TP.HCM
      </h1>

      <div className="flex justify-center mb-6 flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-full text-sm transition duration-300 ${
            selectedDistrict === ""
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
          onClick={() => handleDistrictChange("")}
        >
          Tất cả
        </button>
        {districts.map((district) => (
          <button
            key={district}
            className={`px-4 py-2 rounded-full text-sm transition duration-300 ${
              selectedDistrict === district
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
            onClick={() => handleDistrictChange(district)}
          >
            {district}
          </button>
        ))}
      </div>

      {error && <p className="text-center text-red-600 mb-6">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedListings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl"
          >
            <img
              src={
                listing.images[0]?.url ||
                "/placeholder.svg?height=200&width=300"
              }
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {listing.title}
              </h2>
              <p className="text-gray-600 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                {listing.location.address}, {listing.location.district},{" "}
                {listing.location.city}
              </p>
              <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-bold text-blue-600">
                  {listing.price.toLocaleString()} VND/tháng
                </p>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Ở ghép
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="flex items-center text-gray-700">
                  <FaUserFriends className="mr-2 text-blue-500" />
                  <strong>Số người ở ghép:</strong>{" "}
                  {listing.maxOccupants || "Chưa xác định"}
                </p>
                <p className="flex items-center text-gray-700">
                  <FaRulerCombined className="mr-2 text-blue-500" />
                  <strong>Diện tích:</strong> {listing.size} m²
                </p>
                <p className="flex items-center text-gray-700">
                  <strong className="mr-2">Tiện ích:</strong>
                  {listing.amenities.hasWifi && (
                    <FaWifi className="mr-1 text-blue-500" title="Wifi" />
                  )}
                  {listing.amenities.hasParking && (
                    <FaParking
                      className="mr-1 text-blue-500"
                      title="Bãi đậu xe"
                    />
                  )}
                  {listing.amenities.hasAirConditioner && (
                    <FaSnowflake
                      className="mr-1 text-blue-500"
                      title="Điều hòa"
                    />
                  )}
                  {listing.amenities.hasKitchen && (
                    <FaUtensils
                      className="mr-1 text-blue-500"
                      title="Nhà bếp"
                    />
                  )}
                  {listing.amenities.hasElevator && (
                    <faElevator
                      className="mr-1 text-blue-500"
                      title="Thang máy"
                    />
                  )}
                </p>
              </div>
              <Link
                to={`/listings/${listing._id}`}
                className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 hover:bg-blue-700"
        >
          Trang trước
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 hover:bg-blue-700"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}
