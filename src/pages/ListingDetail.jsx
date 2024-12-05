import React, { useEffect, useState } from "react";
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
import ReportForm from "./ReportForm"; // Add this import
import BookingForm from "./BookingForm";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaDollarSign,
  FaHome,
  FaWifi,
  FaCar,
  FaSnowflake,
  FaShower,
  FaUtensils,
  FaBolt,
  FaTint,
  FaTrashAlt,
  FaStar,
  FaEye,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaWhatsapp,
  FaZalo,
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
  const [loadingFavorite, setLoadingFavorite] = useState(false); // Hiệu ứng loading yêu thích
  const [id_Favorite, setIdFavorite] = useState(null);

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
  }, [id]);
  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào mục yêu thích!");
      return;
    }

    setLoadingFavorite(true); // Bắt đầu hiệu ứng loading

    try {
      if (isFavorited) {
        // Xóa mục yêu thích dựa trên id_Favorite
        if (!id_Favorite) {
          toast.error("Không tìm thấy ID mục yêu thích để xóa!");
          return;
        }
        await removeFavourite(id_Favorite); // Gửi ID yêu thích để xóa
        setIsFavorited(false);
        setIdFavorite(null); // Xóa ID khỏi trạng thái
        toast.success("Đã xóa khỏi mục yêu thích!");
      } else {
        // Thêm mục yêu thích
        const response = await createFavourite(user.id, id);
        const newIdFavorite = response.data._id; // Lấy ID mới từ API
        console.log("ID yêu thích mới:", newIdFavorite);
        setIsFavorited(true);
        setIdFavorite(newIdFavorite); // Lưu ID vào trạng thái
        toast.success("Đã thêm vào mục yêu thích!");
      }
    } catch (err) {
      console.error("Lỗi khi thao tác với mục yêu thích:", err);
      toast.error(`Không thể cập nhật yêu thích: ${err.message}`);
    } finally {
      setLoadingFavorite(false); // Kết thúc hiệu ứng loading
    }
  };

  // Hàm điều hướng (không cần thay đổi)
  const handleNavigate = (path) => {
    navigate(path);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
    );
  };

  const handleReport = () => {
    setShowReportForm(true);
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
      console.log(reportData);

      if (response.ok) {
        toast.success("Báo cáo đã được gửi thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
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
      });
    }
  };
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải...
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const { phone, address, username, avatar, isOnline } = landlord || {};

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-bold mb-4 text-indigo-800">
                {listing.title}
              </h1>
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center ${
                    isFavorited ? "text-red-500" : "text-gray-500"
                  } hover:text-red-700 transition duration-300`}
                  disabled={loadingFavorite} // Khóa nút khi đang loading
                >
                  {isFavorited ? (
                    <FaHeart size={24} />
                  ) : (
                    <FaRegHeart size={24} />
                  )}
                  <span className="ml-2 text-lg">
                    {loadingFavorite ? "Đang xử lý..." : "Yêu thích"}
                  </span>
                </button>
                <div className="flex items-center text-indigo-600">
                  <FaEye className="mr-2" size={24} />
                  <span className="text-lg">{listing.views} lượt xem</span>
                </div>
              </div>
              <div className="relative mb-8">
                <img
                  src={listing.images[currentImageIndex].url}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
                >
                  <FaChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
                >
                  <FaChevronRight size={24} />
                </button>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
                  Mô tả
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {listing.description}
                </p>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
                  Thông tin chi tiết
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    icon={FaDollarSign}
                    label="Giá"
                    value={`${
                      listing.price
                        ? listing.price.toLocaleString()
                        : "Chưa có giá"
                    } VND/tháng`}
                  />
                  <InfoItem
                    icon={FaHome}
                    label="Loại phòng"
                    value={listing.roomType}
                  />
                  <InfoItem
                    icon={FaHome}
                    label="Diện tích"
                    value={`${listing.size} m²`}
                  />
                  <InfoItem
                    icon={FaHome}
                    label="Tình trạng"
                    value={listing.availability ? "Còn trống" : "Đã cho thuê"}
                  />
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
                  Vị trí
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    icon={FaMapMarkerAlt}
                    label="Địa chỉ"
                    value={listing.location?.address || "Chưa có địa chỉ"}
                  />
                  <InfoItem
                    icon={FaMapMarkerAlt}
                    label="Thành phố"
                    value={listing.location?.city || "Chưa có thông tin"}
                  />
                  <InfoItem
                    icon={FaMapMarkerAlt}
                    label="Quận/Huyện"
                    value={listing.location?.district || "Chưa có thông tin"}
                  />
                  <InfoItem
                    icon={FaMapMarkerAlt}
                    label="Phường/Xã"
                    value={listing.location?.ward || "Chưa có thông tin"}
                  />
                  <Map
                    latitude={listing.location.geoLocation?.coordinates[1]}
                    longitude={listing.location.geoLocation?.coordinates[0]}
                  />
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
                  Tiện ích
                </h2>
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
                    icon={FaUtensils}
                    label="Bếp"
                    available={listing.amenities?.hasKitchen}
                  />
                  <AmenityItem
                    icon={FaCar}
                    label="Bãi đỗ xe"
                    available={listing.amenities?.hasParking}
                  />
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
                  Chi phí bổ sung
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
                    icon={FaTrashAlt}
                    label="Dọn dẹp"
                    value={`${
                      listing.additionalCosts?.cleaning || 0
                    } VND/tháng`}
                  />
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
                  Đánh giá
                </h2>
                <div className="flex items-center bg-yellow-100 p-4 rounded-lg">
                  <FaStar className="text-yellow-500 mr-2" size={24} />
                  <span className="text-2xl font-bold text-yellow-700">
                    {listing.averageRating}
                  </span>
                  <span className="text-gray-600 ml-2">
                    ({listing.views} lượt đánh giá)
                  </span>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
                  Bình luận
                </h2>
                <Comments listingId={id} />
              </div>
            </div>
            <div className="md:w-1/3 bg-indigo-50 p-8">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-semibold mb-6 text-indigo-800">
                  Liên hệ với Chủ trọ
                </h2>
                <div className="flex items-center mb-6">
                  <img
                    src={avatar?.url || "/placeholder.svg"}
                    alt={`${username}'s avatar`}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-indigo-700">
                      {username}
                    </h3>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isOnline ? "bg-green-500" : "bg-gray-400"
                        } mr-2`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {isOnline ? "Trực tuyến" : "Ngoại tuyến"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <FaPhone className="mr-3 text-indigo-600" />
                    <span className="text-gray-700">
                      {phone ? phone : "Chưa có số điện thoại"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-3 text-indigo-600" />
                    <span className="text-gray-700">
                      {address ? address : "Chưa có địa chỉ"}
                    </span>
                  </div>
                </div>
                {user ? (
                  <>
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg mb-4 hover:bg-indigo-700 transition duration-300 font-semibold"
                    >
                      Đặt lịch
                    </button>
                    {/* <button
                      onClick={() => handleNavigate(`/contract`)}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg mb-4 hover:bg-green-600 transition duration-300 font-semibold"
                    >
                      Đặt cọc
                    </button>*/}
                    <button
                      onClick={() => {
                        const phoneNumber = phone; // Lấy số điện thoại của chủ trọ
                        if (phoneNumber) {
                          window.location.href = `https://zalo.me/${phoneNumber}`;
                        } else {
                          alert("Số điện thoại của chủ trọ không khả dụng.");
                        }
                      }}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg mb-4 hover:bg-green-600 transition duration-300 font-semibold"
                    >
                      Zalo
                    </button>
                    <button
                      onClick={handleReport}
                      className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition duration-300 font-semibold flex items-center justify-center"
                    >
                      <FaFlag className="mr-2" />
                      Báo cáo
                    </button>
                  </>
                ) : (
                  <p className="text-center text-gray-600 bg-yellow-100 p-4 rounded-lg">
                    Vui lòng đăng nhập để đặt lịch, đặt cọc hoặc báo cáo.
                  </p>
                )}
              </div>

              {/* New Featured Listings Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                  Tin đăng nổi bật
                </h3>
                <div className="space-y-4">
                  {featuredListings.map((post) => (
                    <Link
                      key={post._id}
                      to={`/listings/${post._id}`}
                      className="flex space-x-4 group"
                    >
                      <img
                        src={post.images[0]?.url || "/placeholder.svg"}
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-red-500 line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-red-500 font-bold">
                          {post.price?.toLocaleString()} VND/tháng
                        </p>
                        <p className="text-gray-500 text-sm">
                          {new Date(post.createdAt).toLocaleDateString()} •{" "}
                          {post.views} lượt xem
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBox landlord={landlord} />
      {showReportForm && (
        <ReportForm
          onClose={() => setShowReportForm(false)}
          onSubmit={handleReportSubmit}
          postId={id}
          userId={user?.id}
        />
      )}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center bg-indigo-50 p-3 rounded-lg">
    <Icon className="text-indigo-600 mr-3" size={20} />
    <div>
      <span className="font-semibold text-indigo-800">{label}:</span>
      <span className="ml-2 text-gray-700">{value}</span>
    </div>
  </div>
);

const AmenityItem = ({ icon: Icon, label, available }) => (
  <div
    className={`flex items-center ${
      available ? "text-green-600" : "text-gray-400"
    } bg-gray-50 p-3 rounded-lg`}
  >
    <Icon className="mr-3" size={20} />
    <span className={available ? "font-semibold" : ""}>{label}</span>
  </div>
);

export default ListingDetail;
