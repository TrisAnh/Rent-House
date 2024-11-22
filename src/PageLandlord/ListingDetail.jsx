import React, { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Wifi,
  Wind,
  Coffee,
  Car,
  DollarSign,
  Droplet,
  Globe,
  Sparkles,
  Star,
  Eye,
  MapPin,
  Home,
  Square,
  ArrowUpDown,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getPostByIdLandlord, updatePostById } from "../api/post";
import { deletePostById } from "../api/post";
import { Link } from "react-router-dom";

export default function ListingDetailLandlord({ onDelete }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [editingListingId, setEditingListingId] = useState(null);
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user || !user.id) return;

      try {
        setLoading(true);
        const response = await getPostByIdLandlord(user.id);
        setListings(response.data);
      } catch (error) {
        console.error("Không thể tải danh sách bài đăng", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user?.id]);

  const handleDelete = (id) => {
    setSelectedListingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedListingId) return;

    try {
      await deletePostById(selectedListingId);

      setListings(
        listings.filter((listing) => listing._id !== selectedListingId)
      );

      setDeleteModalOpen(false);

      setSelectedListingId(null);

      console.log("Bài đăng đã được xóa thành công");
    } catch (error) {
      console.error("Không thể xóa bài đăng", error);
    }
  };

  const handleEdit = (id) => {
    setEditingListingId(id);
  };

  const handleSave = async (updatedListing) => {
    try {
      await updatePostById(updatedListing._id, updatedListing);
      setListings(
        listings.map((listing) =>
          listing._id === updatedListing._id ? updatedListing : listing
        )
      );
      setEditingListingId(null);

      // Đặt thông báo thành công
      setNotification("Cập nhật bài đăng thành công!");

      // Ẩn thông báo sau 3 giây
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Không thể cập nhật bài đăng", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      {notification && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-md">
          {notification}
        </div>
      )}
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Danh sách bài đăng của bạn
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
          >
            <div className="relative">
              <Link to={`/listings/${listing._id}`}>
                <img
                  src={
                    listing.images[0].url ||
                    "/placeholder.svg?height=200&width=300"
                  }
                  alt={listing.title}
                  className="w-full h-56 object-cover"
                />
              </Link>
              <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 m-4 rounded-full text-sm font-semibold">
                {listing.status}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {listing.title}
                </h2>
                <p className="text-sm text-gray-200 line-clamp-2">
                  {listing.description}
                </p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {listing.price.toLocaleString()} VND
                </span>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Square className="w-5 h-5" />
                  <span className="text-lg font-semibold">
                    {listing.size} m²
                  </span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <p className="text-sm">
                    {listing.location.address}, {listing.location.ward},{" "}
                    {listing.location.district}, {listing.location.city}
                  </p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Home className="w-5 h-5 mr-2" />
                  <p className="text-sm">{listing.roomType}</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2 text-gray-700">Tiện nghi:</h3>
                <div className="grid grid-cols-3 gap-3">
                  {listing.amenities.hasWifi && (
                    <div className="flex items-center text-gray-600">
                      <Wifi className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm">Wifi</span>
                    </div>
                  )}
                  {listing.amenities.hasAirConditioner && (
                    <div className="flex items-center text-gray-600">
                      <Wind className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm">Điều hòa</span>
                    </div>
                  )}
                  {listing.amenities.hasKitchen && (
                    <div className="flex items-center text-gray-600">
                      <Coffee className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm">Bếp</span>
                    </div>
                  )}
                  {listing.amenities.hasParking && (
                    <div className="flex items-center text-gray-600">
                      <Car className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm">Đỗ xe</span>
                    </div>
                  )}
                  {listing.amenities.hasElevator && (
                    <div className="flex items-center text-gray-600">
                      <ArrowUpDown className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-sm">Thang máy</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2 text-gray-700">
                  Chi phí thêm:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-blue-600" /> Điện:{" "}
                    {listing.additionalCosts.electricity} VND
                  </div>
                  <div className="flex items-center">
                    <Droplet className="w-4 h-4 mr-1 text-blue-600" /> Nước:{" "}
                    {listing.additionalCosts.water} VND
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1 text-blue-600" /> Internet:{" "}
                    {listing.additionalCosts.internet} VND
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-blue-600" /> Dọn dẹp:{" "}
                    {listing.additionalCosts.cleaningService} VND
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <Star className="w-5 h-5 mr-1 text-yellow-400" />{" "}
                  {listing.averageRating}/5
                </span>
                <span className="flex items-center">
                  <Eye className="w-5 h-5 mr-1" /> {listing.views} lượt xem
                </span>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(listing._id)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  aria-label="Chỉnh sửa bài đăng"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  aria-label="Xóa bài đăng"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Xác nhận xóa
            </h2>
            <p className="mb-6 text-gray-600">
              Bạn có chắc chắn muốn xóa bài đăng này không?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      {editingListingId && (
        <EditForm
          listing={listings.find((l) => l._id === editingListingId)}
          onSave={handleSave}
          onCancel={() => setEditingListingId(null)}
        />
      )}
    </div>
  );
}
function EditForm({ listing, onSave, onCancel }) {
  const [editedListing, setEditedListing] = useState(listing);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (field, value) => {
    setEditedListing((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const handleAmenityChange = (amenity) => {
    setEditedListing((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [amenity]: !prev.amenities[amenity] },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedListing);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-8 overflow-y-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Chỉnh sửa bài đăng
            </h2>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tiêu đề
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editedListing.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editedListing.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giá (VND)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={editedListing.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="size"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kích thước (m²)
                  </label>
                  <input
                    type="number"
                    id="size"
                    name="size"
                    value={editedListing.size}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="roomType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Loại phòng
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  value={editedListing.roomType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Single">Phòng đơn</option>
                  <option value="Double">Phòng đôi</option>
                  <option value="Apartment">Căn hộ</option>
                  <option value="Shared">Ở ghép</option>
                  <option value="Dormitory">Kí túc xá</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trạng thái
                </label>
                <select
                  id="status"
                  name="status"
                  value={editedListing.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Còn trống</option>
                  <option value="Deleted">Đã xoá</option>
                  <option value="Locked">Đã cho thuê</option>
                  <option value="Pending">Đang xử lý </option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={editedListing.location.address}
                    onChange={(e) =>
                      handleLocationChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Thành phố"
                      value={editedListing.location.city}
                      onChange={(e) =>
                        handleLocationChange("city", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Quận/huyện"
                      value={editedListing.location.district}
                      onChange={(e) =>
                        handleLocationChange("district", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiện nghi
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(editedListing.amenities).map(
                    ([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={key}
                          checked={value}
                          onChange={() => handleAmenityChange(key)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={key}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {key === "hasWifi"
                            ? "Wifi"
                            : key === "hasAirConditioner"
                            ? "Điều hòa"
                            : key === "hasKitchen"
                            ? "Bếp"
                            : key === "hasParking"
                            ? "Đỗ xe"
                            : key === "hasElevator"
                            ? "Thang máy"
                            : key}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chi phí thêm
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "cleaningService",
                    "electricity",
                    "internet",
                    "security",
                    "water",
                  ].map((cost) => (
                    <div key={cost}>
                      <label
                        htmlFor={cost}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {cost === "cleaningService"
                          ? "Dọn dẹp"
                          : cost === "electricity"
                          ? "Điện"
                          : cost === "internet"
                          ? "Internet"
                          : cost === "security"
                          ? "An ninh"
                          : "Nước"}
                      </label>
                      <input
                        type="number"
                        id={cost}
                        name={`additionalCosts.${cost}`}
                        value={editedListing.additionalCosts[cost]}
                        onChange={(e) =>
                          setEditedListing((prev) => ({
                            ...prev,
                            additionalCosts: {
                              ...prev.additionalCosts,
                              [cost]: parseInt(e.target.value),
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh và Video
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {editedListing.images.map((image, index) => (
                  <div key={index} className="relative">
                    {image.endsWith(".mp4") ? (
                      <video
                        src={image}
                        className="w-full h-48 object-cover rounded-md"
                        controls
                      />
                    ) : (
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setEditedListing((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }))
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const newImages = files.map((file) =>
                    URL.createObjectURL(file)
                  );
                  setEditedListing((prev) => ({
                    ...prev,
                    images: [...prev.images, ...newImages],
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
