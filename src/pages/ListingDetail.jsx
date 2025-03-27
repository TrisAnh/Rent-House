"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getPostById,
  getTopViewedPosts,
  incrementViewCount,
} from "../api/post";
import { getUserById } from "../api/users";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import Comments from "../pages/Comment";
import ChatBox from "../pages/ChatBox";
import ReportForm from "./ReportForm";
import BookingForm from "./BookingForm";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaDollarSign,
  FaWifi,
  FaSnowflake,
  FaShower,
  FaBolt,
  FaTint,
  FaStar,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaImages,
  FaInfoCircle,
  FaTools,
  FaComments,
  FaArrowLeft,
  FaTimes,
  FaComment,
  FaCalendarAlt,
  FaShareAlt,
  FaCheck,
  FaRuler,
  FaBuilding,
  FaClipboardList,
  FaCity,
  FaMapPin,
  FaStreetView,
  FaParking,
  FaUtensils as FaKitchen,
  FaLightbulb,
  FaWater,
  FaBroom,
  FaNetworkWired,
  FaRegCalendarAlt,
  FaPhoneAlt,
  FaExternalLinkAlt,
  FaAngleRight,
  FaAngleDown,
  FaAngleUp,
  FaMapMarkedAlt,
  FaRegStar,
  FaStarHalfAlt,
  FaLock,
  FaCheckCircle,
  FaInfoCircle as FaInfoIcon,
  FaExclamationCircle,
  FaMoneyBillWave as FaMoneyBill,
  FaUserCircle as FaUserCircleIcon,
  FaFacebook,
} from "react-icons/fa";
import Map from "./Map";
import { createFavourite, removeFavourite } from "../api/favourites";

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredListings, setFeaturedListings] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showReportForm, setShowReportForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [id_Favorite, setIdFavorite] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await getPostById(id);
        setListing(response.data);
        if (response.data.landlord._id) {
          const landlordResponse = await getUserById(
            response.data.landlord._id
          );
          setLandlord(landlordResponse.data);
        }
        await incrementViewCount(id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedListings = async () => {
      try {
        const response = await getTopViewedPosts();
        setFeaturedListings(response.data || []);
      } catch (err) {
        console.error("Error fetching featured listings:", err);
      }
    };

    if (id) {
      fetchListing();
      fetchFeaturedListings();
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào mục yêu thích!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "custom-toast",
      });
      return;
    }

    setLoadingFavorite(true);

    try {
      if (isFavorited) {
        if (!id_Favorite) {
          toast.error("Không tìm thấy ID mục yêu thích để xóa!");
          return;
        }
        await removeFavourite(id_Favorite);
        setIsFavorited(false);
        setIdFavorite(null);
        toast.success("Đã xóa khỏi mục yêu thích!", {
          icon: <FaCheckCircle className="text-green-500" />,
        });
      } else {
        const response = await createFavourite(user.id, id);
        const newIdFavorite = response.data._id;
        setIsFavorited(true);
        setIdFavorite(newIdFavorite);
        toast.success("Đã thêm vào mục yêu thích!", {
          icon: <FaHeart className="text-red-500" />,
        });
      }
    } catch (err) {
      console.error("Lỗi khi thao tác với mục yêu thích:", err);
      toast.error(`Không thể cập nhật yêu thích: ${err.message}`);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const nextImage = () => {
    if (!listing || !listing.images || listing.images.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!listing || !listing.images || listing.images.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
    );
  };

  const handleReport = () => {
    setShowReportForm(true);
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReportSubmit = async (reportData) => {
    try {
      const response = await fetch(
        "https://be-android-project.onrender.com/api/report/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportData),
        }
      );

      if (response.ok) {
        toast.success("Báo cáo đã được gửi thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: <FaCheckCircle className="text-green-500" />,
        });
        setShowReportForm(false);
      } else {
        throw new Error("Gửi báo cáo thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo:", error);
      toast.error("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: <FaExclamationCircle className="text-red-500" />,
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-star-${i}`} className="text-yellow-400" />
      );
    }

    return <div className="flex">{stars}</div>;
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-100 z-50">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-indigo-800 font-medium text-xl">
          Đang tải thông tin phòng trọ...
        </p>
        <p className="text-indigo-600 mt-2">Vui lòng đợi trong giây lát</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <FaExclamationCircle className="text-red-500 text-5xl" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Đã xảy ra lỗi
          </h2>
          <p className="text-red-500 text-center font-medium mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center font-medium"
          >
            <FaArrowLeft className="mr-2" /> Quay lại trang trước
          </button>
        </div>
      </div>
    );

  if (!listing) return null;

  const { phone, address, username, avatar, isOnline } = landlord || {};

  // Mobile tab navigation
  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-indigo-900 flex items-center">
                  <FaInfoCircle className="mr-2 text-indigo-600" /> Thông tin
                  chi tiết
                </h2>
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200">
                  <FaStar className="text-yellow-500 mr-1" size={16} />
                  <span className="font-bold text-yellow-700">
                    {listing.averageRating || "5.0"}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">
                    ({listing.views || 0} đánh giá)
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={FaDollarSign}
                  label="Giá thuê"
                  value={`${
                    listing.price
                      ? listing.price.toLocaleString()
                      : "Chưa có giá"
                  } VND/tháng`}
                  highlight={true}
                />
                <InfoItem
                  icon={FaRuler}
                  label="Diện tích"
                  value={`${listing.size} m²`}
                />
                <InfoItem
                  icon={FaBuilding}
                  label="Loại phòng"
                  value={listing.roomType}
                />
                <InfoItem
                  icon={FaClipboardList}
                  label="Tình trạng"
                  value={listing.availability ? "Còn trống" : "Đã cho thuê"}
                  status={listing.availability ? "available" : "unavailable"}
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-indigo-900 flex items-center mb-4">
                <FaMapMarkedAlt className="mr-2 text-indigo-600" /> Vị trí
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <InfoItem
                  icon={FaMapPin}
                  label="Địa chỉ"
                  value={listing.location?.address || "Chưa có địa chỉ"}
                />
                <InfoItem
                  icon={FaCity}
                  label="Thành phố"
                  value={listing.location?.city || "Chưa có thông tin"}
                />
                <InfoItem
                  icon={FaMapMarkerAlt}
                  label="Quận/Huyện"
                  value={listing.location?.district || "Chưa có thông tin"}
                />
                <InfoItem
                  icon={FaStreetView}
                  label="Phường/Xã"
                  value={listing.location?.ward || "Chưa có thông tin"}
                />
              </div>
              <div className="h-60 sm:h-80 w-full rounded-xl overflow-hidden shadow-md">
                <Map
                  latitude={listing.location.geoLocation?.coordinates[1]}
                  longitude={listing.location.geoLocation?.coordinates[0]}
                />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-indigo-900 flex items-center">
                  <FaTools className="mr-2 text-indigo-600" /> Tiện ích
                </h2>
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800 transition-colors"
                >
                  {showAllAmenities ? "Thu gọn" : "Xem tất cả"}
                  {showAllAmenities ? (
                    <FaAngleUp className="ml-1" />
                  ) : (
                    <FaAngleDown className="ml-1" />
                  )}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <AmenityItem
                  icon={FaWifi}
                  label="Wifi"
                  available={listing.amenities?.hasWifi}
                />
                <AmenityItem
                  icon={FaSnowflake}
                  label="Điều hòa"
                  available={listing.amenities?.hasAirConditioner}
                />
                <AmenityItem
                  icon={FaShower}
                  label="Máy nước nóng"
                  available={listing.amenities?.hasHeater}
                />
                <AmenityItem
                  icon={FaKitchen}
                  label="Bếp"
                  available={listing.amenities?.hasKitchen}
                />
                {showAllAmenities && (
                  <>
                    <AmenityItem
                      icon={FaParking}
                      label="Bãi đỗ xe"
                      available={listing.amenities?.hasParking}
                    />
                    <AmenityItem
                      icon={FaLightbulb}
                      label="Điện riêng"
                      available={true}
                    />
                    <AmenityItem
                      icon={FaWater}
                      label="Nước riêng"
                      available={true}
                    />
                    <AmenityItem
                      icon={FaNetworkWired}
                      label="Internet riêng"
                      available={listing.amenities?.hasWifi}
                    />
                    <AmenityItem
                      icon={FaBroom}
                      label="Dọn dẹp"
                      available={listing.additionalCosts?.cleaning > 0}
                    />
                    <AmenityItem
                      icon={FaLock}
                      label="An ninh"
                      available={true}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-indigo-900 flex items-center mb-4">
                <FaMoneyBill className="mr-2 text-indigo-600" /> Chi phí bổ sung
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={FaBolt}
                  label="Điện"
                  value={`${listing.additionalCosts?.electricity || 0} VND/kWh`}
                />
                <InfoItem
                  icon={FaTint}
                  label="Nước"
                  value={`${listing.additionalCosts?.water || 0} VND/m³`}
                />
                <InfoItem
                  icon={FaWifi}
                  label="Internet"
                  value={`${listing.additionalCosts?.internet || 0} VND/tháng`}
                />
                <InfoItem
                  icon={FaBroom}
                  label="Dọn dẹp"
                  value={`${listing.additionalCosts?.cleaning || 0} VND/tháng`}
                />
              </div>
            </div>
          </>
        );
      case "description":
        return (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-indigo-900 flex items-center mb-4">
              <FaInfoIcon className="mr-2 text-indigo-600" /> Mô tả chi tiết
            </h2>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <p
                className={`text-gray-700 leading-relaxed whitespace-pre-line ${
                  !showFullDescription && "line-clamp-6"
                }`}
              >
                {listing.description}
              </p>
              {listing.description && listing.description.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center"
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                  {showFullDescription ? (
                    <FaAngleUp className="ml-1" />
                  ) : (
                    <FaAngleDown className="ml-1" />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      case "comments":
        return (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-indigo-900 flex items-center">
                <FaComments className="mr-2 text-indigo-600" /> Đánh giá & Bình
                luận
              </h2>
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200">
                <FaStar className="text-yellow-500 mr-1" size={16} />
                <span className="font-bold text-yellow-700">
                  {listing.averageRating || "5.0"}
                </span>
                <span className="text-gray-500 text-xs ml-1">
                  ({listing.views || 0} đánh giá)
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Comments listingId={id} />
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-indigo-900 flex items-center mb-4">
              <FaUserCircleIcon className="mr-2 text-indigo-600" /> Liên hệ với
              Chủ trọ
            </h2>
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex items-center mb-5">
                <div className="relative">
                  <img
                    src={avatar?.url || "/placeholder.svg?height=80&width=80"}
                    alt={`${username}'s avatar`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-indigo-900">
                    {username || "Chủ trọ"}
                  </h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">
                      {isOnline ? "Đang trực tuyến" : "Không trực tuyến"}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-600">
                      Phản hồi trong vòng 24 giờ
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-5">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaPhoneAlt className="text-indigo-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Số điện thoại</div>
                    <div className="font-medium">
                      {phone ? phone : "Chưa có số điện thoại"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-indigo-600 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Địa chỉ</div>
                    <div className="font-medium">
                      {address ? address : "Chưa có địa chỉ"}
                    </div>
                  </div>
                </div>
              </div>
              {user ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold flex items-center justify-center"
                  >
                    <FaCalendarAlt className="mr-2" /> Đặt lịch xem phòng
                  </button>
                  <button
                    onClick={() => {
                      const phoneNumber = phone;
                      if (phoneNumber) {
                        window.location.href = `tel:${phoneNumber}`;
                      } else {
                        toast.error(
                          "Số điện thoại của chủ trọ không khả dụng.",
                          {
                            icon: (
                              <FaExclamationCircle className="text-red-500" />
                            ),
                          }
                        );
                      }
                    }}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold flex items-center justify-center"
                  >
                    <FaComment className="mr-2" /> Nhắn tin
                  </button>
                  <button
                    onClick={handleReport}
                    className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition duration-300 font-semibold flex items-center justify-center"
                  >
                    <FaFlag className="mr-2" /> Báo cáo tin đăng
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FaExclamationCircle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700">
                      Vui lòng{" "}
                      <Link
                        to="/login"
                        className="text-indigo-600 font-medium hover:underline"
                      >
                        đăng nhập
                      </Link>{" "}
                      để đặt lịch xem phòng, liên hệ hoặc báo cáo tin đăng này.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Back button and breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-700 hover:text-indigo-900 transition-colors bg-white px-3 py-2 rounded-lg shadow-sm"
          >
            <FaArrowLeft className="mr-2" /> Quay lại
          </button>
          <div className="hidden sm:flex items-center text-sm text-gray-600 mt-2 sm:mt-0">
            <Link to="/" className="hover:text-indigo-700 transition-colors">
              Trang chủ
            </Link>
            <FaAngleRight className="mx-2" />
            <Link
              to="/listings"
              className="hover:text-indigo-700 transition-colors"
            >
              Danh sách phòng trọ
            </Link>
            <FaAngleRight className="mx-2" />
            <span className="text-indigo-700 font-medium truncate max-w-[200px]">
              {listing.title}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left column */}
            <div className="lg:w-2/3 p-5 sm:p-6 lg:p-8">
              {/* Title and actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-900 mb-4 sm:mb-0">
                  {listing.title}
                </h1>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleFavorite}
                    className={`flex items-center ${
                      isFavorited ? "text-red-500" : "text-gray-500"
                    } hover:text-red-600 transition duration-300 bg-gray-50 px-3 py-2 rounded-lg`}
                    disabled={loadingFavorite}
                  >
                    {isFavorited ? (
                      <FaHeart size={20} />
                    ) : (
                      <FaRegHeart size={20} />
                    )}
                    <span className="ml-2 font-medium">
                      {loadingFavorite ? "Đang xử lý..." : "Yêu thích"}
                    </span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300 bg-indigo-50 px-3 py-2 rounded-lg"
                    >
                      <FaShareAlt size={18} />
                      <span className="ml-2 font-medium">Chia sẻ</span>
                    </button>
                    {showShareOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 p-2">
                        <button
                          onClick={copyToClipboard}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center"
                        >
                          {copied ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                          ) : (
                            <FaExternalLinkAlt className="mr-2" />
                          )}
                          {copied ? "Đã sao chép" : "Sao chép liên kết"}
                        </button>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            window.location.href
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center"
                        >
                          <FaFacebook className="mr-2 text-blue-600" />
                          Chia sẻ Facebook
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Listing meta info */}
              <div className="flex flex-wrap items-center mb-6 text-gray-600 text-sm">
                <div className="flex items-center mr-4 mb-2">
                  <FaMapMarkerAlt className="mr-1 text-indigo-500" />
                  <span>
                    {listing.location?.district || "Chưa có thông tin"},{" "}
                    {listing.location?.city || "Chưa có thông tin"}
                  </span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <FaRegCalendarAlt className="mr-1 text-indigo-500" />
                  <span>
                    Đăng ngày: {formatDate(listing.createdAt || new Date())}
                  </span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <FaEye className="mr-1 text-indigo-500" />
                  <span>{listing.views || 0} lượt xem</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaStar className="mr-1 text-yellow-500" />
                  <span>
                    {listing.averageRating || "5.0"} ({listing.views || 0} đánh
                    giá)
                  </span>
                </div>
              </div>

              {/* Image gallery */}
              <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={
                    listing.images[currentImageIndex]?.url ||
                    "/placeholder.svg?height=500&width=800"
                  }
                  alt={`Hình ảnh ${currentImageIndex + 1}`}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition duration-300"
                >
                  <FaChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition duration-300"
                >
                  <FaChevronRight size={18} />
                </button>
                <button
                  onClick={() => setShowGallery(true)}
                  className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg text-sm flex items-center hover:bg-opacity-80 transition duration-300"
                >
                  <FaImages className="mr-2" /> Xem tất cả{" "}
                  {listing.images.length} ảnh
                </button>
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm">
                  {currentImageIndex + 1}/{listing.images.length}
                </div>
              </div>

              {/* Thumbnail gallery */}
              <div className="mb-8 overflow-x-auto">
                <div className="flex space-x-2 pb-2">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden ${
                        currentImageIndex === index
                          ? "ring-2 ring-indigo-500"
                          : "opacity-70 hover:opacity-100 transition"
                      }`}
                    >
                      <img
                        src={image.url || "/placeholder.svg?height=80&width=80"}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-16 w-16 sm:h-20 sm:w-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile tabs */}
              <div className="flex overflow-x-auto mb-6 lg:hidden">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 mr-2 rounded-lg text-sm whitespace-nowrap flex items-center ${
                    activeTab === "details"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaInfoCircle className="mr-1" /> Chi tiết
                </button>
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-4 py-2 mr-2 rounded-lg text-sm whitespace-nowrap flex items-center ${
                    activeTab === "description"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaInfoIcon className="mr-1" /> Mô tả
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`px-4 py-2 mr-2 rounded-lg text-sm whitespace-nowrap flex items-center ${
                    activeTab === "comments"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaComments className="mr-1" /> Đánh giá
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center ${
                    activeTab === "contact"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaUserCircleIcon className="mr-1" /> Liên hệ
                </button>
              </div>

              {/* Mobile tab content */}
              <div className="lg:hidden">{renderTabContent()}</div>

              {/* Desktop content */}
              <div className="hidden lg:block">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-indigo-900 flex items-center mb-4">
                    <FaInfoIcon className="mr-2 text-indigo-600" /> Mô tả chi
                    tiết
                  </h2>
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {listing.description}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-indigo-900 flex items-center mb-4">
                    <FaInfoCircle className="mr-2 text-indigo-600" /> Thông tin
                    chi tiết
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      icon={FaDollarSign}
                      label="Giá thuê"
                      value={`${
                        listing.price
                          ? listing.price.toLocaleString()
                          : "Chưa có giá"
                      } VND/tháng`}
                      highlight={true}
                    />
                    <InfoItem
                      icon={FaRuler}
                      label="Diện tích"
                      value={`${listing.size} m²`}
                    />
                    <InfoItem
                      icon={FaBuilding}
                      label="Loại phòng"
                      value={listing.roomType}
                    />
                    <InfoItem
                      icon={FaClipboardList}
                      label="Tình trạng"
                      value={listing.availability ? "Còn trống" : "Đã cho thuê"}
                      status={
                        listing.availability ? "available" : "unavailable"
                      }
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-indigo-900 flex items-center mb-4">
                    <FaMapMarkedAlt className="mr-2 text-indigo-600" /> Vị trí
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <InfoItem
                      icon={FaMapPin}
                      label="Địa chỉ"
                      value={listing.location?.address || "Chưa có địa chỉ"}
                    />
                    <InfoItem
                      icon={FaCity}
                      label="Thành phố"
                      value={listing.location?.city || "Chưa có thông tin"}
                    />
                    <InfoItem
                      icon={FaMapMarkerAlt}
                      label="Quận/Huyện"
                      value={listing.location?.district || "Chưa có thông tin"}
                    />
                    <InfoItem
                      icon={FaStreetView}
                      label="Phường/Xã"
                      value={listing.location?.ward || "Chưa có thông tin"}
                    />
                  </div>
                  <div className="h-80 w-full rounded-xl overflow-hidden shadow-md">
                    <Map
                      latitude={listing.location.geoLocation?.coordinates[1]}
                      longitude={listing.location.geoLocation?.coordinates[0]}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
                      <FaTools className="mr-2 text-indigo-600" /> Tiện ích
                    </h2>
                    <button
                      onClick={() => setShowAllAmenities(!showAllAmenities)}
                      className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors"
                    >
                      {showAllAmenities ? "Thu gọn" : "Xem tất cả"}
                      {showAllAmenities ? (
                        <FaAngleUp className="ml-1" />
                      ) : (
                        <FaAngleDown className="ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <AmenityItem
                      icon={FaWifi}
                      label="Wifi"
                      available={listing.amenities?.hasWifi}
                    />
                    <AmenityItem
                      icon={FaSnowflake}
                      label="Điều hòa"
                      available={listing.amenities?.hasAirConditioner}
                    />
                    <AmenityItem
                      icon={FaShower}
                      label="Máy nước nóng"
                      available={listing.amenities?.hasHeater}
                    />
                    <AmenityItem
                      icon={FaKitchen}
                      label="Bếp"
                      available={listing.amenities?.hasKitchen}
                    />
                    <AmenityItem
                      icon={FaParking}
                      label="Bãi đỗ xe"
                      available={listing.amenities?.hasParking}
                    />
                    {showAllAmenities && (
                      <>
                        <AmenityItem
                          icon={FaLightbulb}
                          label="Điện riêng"
                          available={true}
                        />
                        <AmenityItem
                          icon={FaWater}
                          label="Nước riêng"
                          available={true}
                        />
                        <AmenityItem
                          icon={FaNetworkWired}
                          label="Internet riêng"
                          available={listing.amenities?.hasWifi}
                        />
                        <AmenityItem
                          icon={FaBroom}
                          label="Dọn dẹp"
                          available={listing.additionalCosts?.cleaning > 0}
                        />
                        <AmenityItem
                          icon={FaLock}
                          label="An ninh"
                          available={true}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-indigo-900 flex items-center mb-4">
                    <FaMoneyBill className="mr-2 text-indigo-600" /> Chi phí bổ
                    sung
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      icon={FaBolt}
                      label="Điện"
                      value={`${
                        listing.additionalCosts?.electricity || 0
                      } VND/kWh`}
                    />
                    <InfoItem
                      icon={FaTint}
                      label="Nước"
                      value={`${listing.additionalCosts?.water || 0} VND/m³`}
                    />
                    <InfoItem
                      icon={FaWifi}
                      label="Internet"
                      value={`${
                        listing.additionalCosts?.internet || 0
                      } VND/tháng`}
                    />
                    <InfoItem
                      icon={FaBroom}
                      label="Dọn dẹp"
                      value={`${
                        listing.additionalCosts?.cleaning || 0
                      } VND/tháng`}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
                      <FaComments className="mr-2 text-indigo-600" /> Đánh giá &
                      Bình luận
                    </h2>
                    <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                      <div className="flex mr-2">
                        {renderStarRating(listing.averageRating || 5)}
                      </div>
                      <span className="font-bold text-yellow-700">
                        {listing.averageRating || "5.0"}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({listing.views || 0} đánh giá)
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <Comments listingId={id} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - only visible on desktop */}
            <div className="hidden lg:block lg:w-1/3 bg-indigo-50 p-8">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-indigo-900 mb-6">
                  Liên hệ với Chủ trọ
                </h2>
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={avatar?.url || "/placeholder.svg?height=80&width=80"}
                      alt={`${username}'s avatar`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-indigo-900">
                      {username || "Chủ trọ"}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">
                        {isOnline ? "Đang trực tuyến" : "Không trực tuyến"}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-600">
                        Phản hồi trong vòng 24 giờ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaPhoneAlt className="text-indigo-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Số điện thoại</div>
                      <div className="font-medium">
                        {phone ? phone : "Chưa có số điện thoại"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-indigo-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Địa chỉ</div>
                      <div className="font-medium">
                        {address ? address : "Chưa có địa chỉ"}
                      </div>
                    </div>
                  </div>
                </div>
                {user ? (
                  <>
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg mb-4 hover:bg-indigo-700 transition duration-300 font-semibold flex items-center justify-center"
                    >
                      <FaCalendarAlt className="mr-2" /> Đặt lịch xem phòng
                    </button>
                    <button
                      onClick={() => {
                        const phoneNumber = phone;
                        if (phoneNumber) {
                          window.location.href = `tel:${phoneNumber}`;
                        } else {
                          toast.error(
                            "Số điện thoại của chủ trọ không khả dụng.",
                            {
                              icon: (
                                <FaExclamationCircle className="text-red-500" />
                              ),
                            }
                          );
                        }
                      }}
                      className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg mb-4 hover:bg-blue-600 transition duration-300 font-semibold flex items-center justify-center"
                    >
                      <FaComment className="mr-2" /> Nhắn tin
                    </button>
                    <button
                      onClick={handleReport}
                      className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition duration-300 font-semibold flex items-center justify-center"
                    >
                      <FaFlag className="mr-2" /> Báo cáo tin đăng
                    </button>
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <FaExclamationCircle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">
                        Vui lòng{" "}
                        <Link
                          to="/login"
                          className="text-indigo-600 font-medium hover:underline"
                        >
                          đăng nhập
                        </Link>{" "}
                        để đặt lịch xem phòng, liên hệ hoặc báo cáo tin đăng
                        này.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Featured Listings Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">
                  Tin đăng nổi bật
                </h3>
                <div className="space-y-4">
                  {featuredListings.slice(0, 5).map((post) => (
                    <Link
                      key={post._id}
                      to={`/listings/${post._id}`}
                      className="flex space-x-4 group"
                    >
                      <img
                        src={
                          post.images[0]?.url ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm group-hover:shadow-md transition"
                      />
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-red-500 font-bold mt-1">
                          {post.price?.toLocaleString()} VND/tháng
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <FaMapMarkerAlt className="mr-1" />
                          <span className="truncate">
                            {post.location?.district}
                          </span>
                          <span className="mx-1">•</span>
                          <FaEye className="mr-1" />
                          <span>{post.views} lượt xem</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/listings"
                  className="mt-4 text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center justify-center"
                >
                  Xem tất cả tin đăng <FaAngleRight className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen image gallery */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white">
            <h3 className="text-xl font-bold">
              Ảnh {currentImageIndex + 1}/{listing.images.length} -{" "}
              {listing.title}
            </h3>
            <button
              onClick={() => setShowGallery(false)}
              className="text-white hover:text-gray-300 p-2"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <img
              src={
                listing.images[currentImageIndex]?.url ||
                "/placeholder.svg?height=800&width=1200"
              }
              alt={`Full size ${currentImageIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-300"
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-300"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
          <div className="p-4 overflow-x-auto bg-black bg-opacity-75">
            <div className="flex space-x-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 ${
                    currentImageIndex === index
                      ? "ring-2 ring-indigo-500"
                      : "opacity-60 hover:opacity-100 transition"
                  }`}
                >
                  <img
                    src={image.url || "/placeholder.svg?height=80&width=80"}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ChatBox landlord={landlord} />

      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <ReportForm
              onClose={() => setShowReportForm(false)}
              onSubmit={handleReportSubmit}
              postId={id}
              userId={user?.id}
            />
          </div>
        </div>
      )}

      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <BookingForm
              landlordId={landlord?._id}
              postId={id}
              onClose={() => setShowBookingForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, highlight, status }) => (
  <div
    className={`flex items-center ${
      highlight ? "bg-indigo-50 border-l-4 border-indigo-500" : "bg-gray-50"
    } p-4 rounded-lg`}
  >
    <Icon
      className={`${
        highlight ? "text-indigo-600" : "text-indigo-500"
      } mr-3 flex-shrink-0`}
      size={18}
    />
    <div className="overflow-hidden">
      <span className="text-sm text-gray-500">{label}</span>
      <div
        className={`font-semibold ${
          status === "available"
            ? "text-green-600"
            : status === "unavailable"
            ? "text-red-500"
            : highlight
            ? "text-indigo-900"
            : "text-gray-800"
        } break-words`}
      >
        {value}
      </div>
    </div>
  </div>
);

const AmenityItem = ({ icon: Icon, label, available }) => (
  <div
    className={`flex items-center ${
      available ? "text-gray-800" : "text-gray-400"
    } bg-gray-50 p-3 rounded-lg border ${
      available ? "border-green-100" : "border-gray-100"
    }`}
  >
    <div
      className={`p-2 rounded-full mr-3 ${
        available ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
      }`}
    >
      <Icon size={16} />
    </div>
    <span className={available ? "font-medium" : ""}>{label}</span>
    {available && <FaCheck className="ml-auto text-green-500" size={14} />}
  </div>
);

export default ListingDetail;
