"use client";

import { useEffect, useState, useCallback } from "react";
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
  Eye,
  MapPin,
  Home,
  Square,
  ArrowUpDown,
  X,
  Calendar,
  AlertCircle,
  Plus,
  Info,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getPostByIdLandlord,
  updatePostById,
  deletePostById,
} from "../api/post";
import { updateAcceptRequest } from "../api/request";
import { updateDeclineRequest } from "../api/request";
import { Link } from "react-router-dom";
import BookingModal from "./formBooking";
import { getRequestByPostId } from "../api/request";

export default function ListingDetailLandlord() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [editingListingId, setEditingListingId] = useState(null);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({});
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({});
  const [pendingBookings, setPendingBookings] = useState({});

  useEffect(() => {
    const fetchListings = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getPostByIdLandlord(user.id);
        const listingsData = response.data;
        setListings(listingsData);

        const counts = {};
        const pendingStatus = {};

        for (const listing of listingsData) {
          try {
            const bookingResponse = await getRequestByPostId(listing._id);
            const requests = Array.isArray(bookingResponse)
              ? bookingResponse
              : bookingResponse.data || [];

            counts[listing._id] = requests.length;
            pendingStatus[listing._id] = requests.some(
              (request) =>
                request.status && request.status.toLowerCase() === "pending"
            );
          } catch (error) {
            console.error(
              `Error fetching bookings for listing ${listing._id}:`,
              error
            );
            counts[listing._id] = 0;
            pendingStatus[listing._id] = false;
          }
        }

        setBookingCounts(counts);
        setPendingBookings(pendingStatus);
      } catch (error) {
        console.error("Không thể tải danh sách bài đăng", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user?.id, updateTrigger]);

  const handleDelete = async (id) => {
    try {
      const bookingResponse = await getRequestByPostId(id);
      const requests = Array.isArray(bookingResponse)
        ? bookingResponse
        : bookingResponse.data || [];

      const hasPendingBooking = requests.some((request) => {
        return request.status && request.status.toLowerCase() === "pending";
      });

      if (hasPendingBooking) {
        setNotifications((prev) => ({
          ...prev,
          [id]: {
            type: "error",
            message:
              "❌ Không thể xóa bài đăng này vì có lịch đặt đang chờ xử lý! Vui lòng xử lý tất cả lịch đặt trước khi xóa.",
          },
        }));
        setTimeout(() => {
          setNotifications((prev) => {
            const newNotifications = { ...prev };
            delete newNotifications[id];
            return newNotifications;
          });
        }, 5000);
        return;
      }

      setSelectedListingId(id);
      setDeleteModalOpen(true);
    } catch (error) {
      console.error("Error checking bookings:", error);
      setSelectedListingId(id);
      setDeleteModalOpen(true);
    }
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

      setBookingCounts((prev) => {
        const newCounts = { ...prev };
        delete newCounts[selectedListingId];
        return newCounts;
      });

      setPendingBookings((prev) => {
        const newPending = { ...prev };
        delete newPending[selectedListingId];
        return newPending;
      });

      setNotifications((prev) => ({
        ...prev,
        [selectedListingId]: {
          type: "success",
          message: "✅ Bài đăng đã được xóa thành công!",
        },
      }));
      setTimeout(() => {
        setNotifications((prev) => {
          const newNotifications = { ...prev };
          delete newNotifications[selectedListingId];
          return newNotifications;
        });
      }, 3000);
    } catch (error) {
      console.error("Không thể xóa bài đăng", error);
      setNotifications((prev) => ({
        ...prev,
        [selectedListingId]: {
          type: "error",
          message: "❌ Không thể xóa bài đăng. Vui lòng thử lại!",
        },
      }));
      setTimeout(() => {
        setNotifications((prev) => {
          const newNotifications = { ...prev };
          delete newNotifications[selectedListingId];
          return newNotifications;
        });
      }, 3000);
      setDeleteModalOpen(false);
      setSelectedListingId(null);
    }
  };

  const handleEdit = (id) => {
    setEditingListingId(id);
  };

  const handleSave = useCallback(async (formData) => {
    console.log("=== HANDLE SAVE DEBUG ===");

    // Debug formData
    console.log("FormData received in handleSave:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    try {
      const id = formData.get("_id");
      console.log("Updating post with ID:", id);

      if (!id) {
        setNotifications((prev) => ({
          ...prev,
          [id]: {
            type: "error",
            message: "❌ Không thể cập nhật bài đăng vì thiếu ID.",
          },
        }));
        return;
      }

      console.log("Calling updatePostById API...");
      const response = await updatePostById(id, formData);
      console.log("API Response:", response);

      if (response && response.data && response.data.post) {
        const updatedPost = response.data.post;
        console.log("Updated post received:", updatedPost);
        console.log("Updated post images count:", updatedPost.images?.length);

        // Force update listings state
        setListings((prevListings) => {
          console.log("=== STATE UPDATE DEBUG ===");
          console.log("Previous listings count:", prevListings.length);

          const newListings = prevListings.map((listing) => {
            if (listing._id === id) {
              console.log("Found listing to update:", listing._id);
              console.log("Old images count:", listing.images?.length);
              console.log("New images count:", updatedPost.images?.length);
              return { ...updatedPost }; // Spread to ensure new object reference
            }
            return listing;
          });

          console.log("New listings created");
          return newListings;
        });

        // Close edit modal
        setEditingListingId(null);

        // Show success notification
        setNotifications((prev) => ({
          ...prev,
          [id]: {
            type: "success",
            message: "✅ Cập nhật bài đăng thành công! Ảnh đã được thêm.",
          },
        }));

        // Force re-fetch data to ensure consistency
        setTimeout(() => {
          setUpdateTrigger((prev) => prev + 1);
        }, 1000);
      } else {
        console.error("Invalid response structure:", response);
        throw new Error("Không nhận được dữ liệu từ server sau khi cập nhật");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bài đăng:", error);
      console.error("Error details:", error.response?.data || error.message);

      const listingId = formData.get("_id");
      setNotifications((prev) => ({
        ...prev,
        [listingId]: {
          type: "error",
          message: `❌ Cập nhật bài đăng thất bại: ${
            error.response?.data?.msg || error.message
          }`,
        },
      }));
    } finally {
      const listingId = formData.get("_id");
      setTimeout(() => {
        setNotifications((prev) => {
          const newNotifications = { ...prev };
          delete newNotifications[listingId];
          return newNotifications;
        });
      }, 5000);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleViewBooking = async (listing) => {
    try {
      const response = await getRequestByPostId(listing._id);
      const requests = Array.isArray(response) ? response : response.data;

      setSelectedBooking({
        _id: listing._id,
        title: listing.title,
        address: `${listing.location.address}, ${listing.location.ward}, ${listing.location.district}, ${listing.location.city}`,
      });

      setBookingRequests(requests);
      setIsBookingModalOpen(true);
    } catch (error) {
      console.error("Error fetching booking requests:", error);
      setNotifications((prev) => ({
        ...prev,
        [listing._id]: {
          type: "error",
          message: "❌ Không thể tải danh sách lịch đặt. Vui lòng thử lại.",
        },
      }));
    }
  };

  const handleAcceptBooking = async (requestId) => {
    try {
      await updateAcceptRequest(requestId);
      setNotifications((prev) => ({
        ...prev,
        [selectedBooking._id]: {
          type: "success",
          message: "✅ Đã chấp nhận đặt phòng thành công",
        },
      }));

      if (selectedBooking && selectedBooking._id) {
        const updatedRequests = await getRequestByPostId(selectedBooking._id);
        const requests = Array.isArray(updatedRequests)
          ? updatedRequests
          : updatedRequests.data || [];
        setBookingRequests(requests);

        setBookingCounts((prev) => ({
          ...prev,
          [selectedBooking._id]: requests.length,
        }));

        setPendingBookings((prev) => ({
          ...prev,
          [selectedBooking._id]: requests.some(
            (request) =>
              request.status && request.status.toLowerCase() === "pending"
          ),
        }));
      }

      setTimeout(() => {
        setNotifications((prev) => {
          const newNotifications = { ...prev };
          delete newNotifications[selectedBooking._id];
          return newNotifications;
        });
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi chấp nhận đặt phòng:", error);
      setNotifications((prev) => ({
        ...prev,
        [selectedBooking._id]: {
          type: "error",
          message: "❌ Không thể chấp nhận đặt phòng. Vui lòng thử lại!",
        },
      }));
      setTimeout(() => {
        setNotifications((prev) => {
          const newNotifications = { ...prev };
          delete newNotifications[selectedBooking._id];
          return newNotifications;
        });
      }, 3000);
    }
  };

  const handleRejectBooking = async (requestId) => {
    try {
      await updateDeclineRequest(requestId);
      setNotifications((prev) => ({
        ...prev,
        [selectedBooking._id]: {
          type: "success",
          message: "✅ Đã từ chối đặt phòng thành công",
        },
      }));

      if (selectedBooking && selectedBooking._id) {
        const updatedRequests = await getRequestByPostId(selectedBooking._id);
        const requests = Array.isArray(updatedRequests)
          ? updatedRequests
          : updatedRequests.data || [];
        setBookingRequests(requests);

        setBookingCounts((prev) => ({
          ...prev,
          [selectedBooking._id]: requests.length,
        }));

        setPendingBookings((prev) => ({
          ...prev,
          [selectedBooking._id]: requests.some(
            (request) =>
              request.status && request.status.toLowerCase() === "pending"
          ),
        }));
      }

      setTimeout(() => {
        setNotifications((prev) => {
          const newNotifications = { ...prev };
          delete newNotifications[selectedBooking._id];
          return newNotifications;
        });
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi từ chối đặt phòng:", error);
      setNotifications((prev) => ({
        ...prev,
        [selectedBooking._id]: {
          type: "error",
          message: "❌ Không thể từ chối đặt phòng. Vui lòng thử lại!",
        },
      }));
      setTimeout(() => {
        setNotifications((prev) => {
          const newNotifications = { ...prev };
          delete newNotifications[selectedBooking._id];
          return newNotifications;
        });
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
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
                    listing.images[0]?.url ||
                    "/placeholder.svg?height=200&width=300" ||
                    "/placeholder.svg"
                  }
                  alt={listing.title}
                  className="w-full h-56 object-cover"
                />
              </Link>
              <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 m-4 rounded-full text-sm font-semibold">
                {listing.status}
              </div>
              {pendingBookings[listing._id] && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white px-2 py-1 m-4 rounded-full text-xs font-semibold flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Có lịch đặt
                </div>
              )}
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
              {notifications[listing._id] && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    notifications[listing._id].type === "success"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    {notifications[listing._id].type === "success" ? (
                      <div className="w-4 h-4 mr-2 text-green-500">✓</div>
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    {notifications[listing._id].message}
                  </div>
                </div>
              )}
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
                  <Eye className="w-5 h-5 mr-1" /> {listing.views} lượt xem
                </span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleViewBooking(listing)}
                  className="relative flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Xem lịch đặt
                  {bookingCounts[listing._id] > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                      {bookingCounts[listing._id]}
                    </span>
                  )}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(listing._id)}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Chỉnh sửa bài đăng"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className={`p-2 rounded-full transition-colors relative ${
                      pendingBookings[listing._id]
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                    aria-label="Xóa bài đăng"
                    title={
                      pendingBookings[listing._id]
                        ? "Không thể xóa vì có lịch đặt đang chờ xử lý"
                        : "Xóa bài đăng"
                    }
                  >
                    <Trash2 className="w-5 h-5" />
                    {pendingBookings[listing._id] && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                </div>
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
              Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không
              thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedListingId(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Xóa bài đăng
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
      {selectedBooking && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          bookingInfo={selectedBooking}
          bookingRequests={bookingRequests}
          onAccept={handleAcceptBooking}
          onReject={handleRejectBooking}
        />
      )}
    </div>
  );
}

function EditForm({ listing, onSave, onCancel }) {
  const [editedListing, setEditedListing] = useState(listing);
  const [newImages, setNewImages] = useState([]);
  const [showImageInfo, setShowImageInfo] = useState(false);

  useEffect(() => {
    setEditedListing((prevState) => ({
      ...prevState,
      _id: listing._id,
    }));
  }, [listing]);

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

  const handleImageUpload = useCallback((e) => {
    console.log("=== IMAGE UPLOAD DEBUG ===");
    console.log("Event target:", e.target);
    console.log("Files:", e.target.files);

    const files = Array.from(e.target.files);
    console.log("Files array:", files);
    console.log("Files count:", files.length);

    if (files.length > 0) {
      files.forEach((file, index) => {
        console.log(`File ${index}:`, {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        });
      });

      setNewImages((prevImages) => {
        const updatedImages = [...prevImages, ...files];
        console.log("Updated newImages:", updatedImages);
        return updatedImages;
      });
    } else {
      console.log("No files selected");
    }
  }, []);

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=== DEBUG FORM SUBMIT ===");
    console.log("New images count:", newImages.length);
    console.log("New images:", newImages);

    const formData = new FormData();

    // Thêm dữ liệu cơ bản (trừ images)
    Object.keys(editedListing).forEach((key) => {
      if (key === "images") {
        return; // Bỏ qua images, xử lý riêng
      }
      if (typeof editedListing[key] === "object") {
        formData.append(key, JSON.stringify(editedListing[key]));
      } else {
        formData.append(key, editedListing[key]);
      }
    });

    // Thêm ảnh mới - sử dụng đúng field name mà backend expect
    if (newImages.length > 0) {
      console.log("Adding images to formData...");
      newImages.forEach((file, index) => {
        console.log(`Adding image ${index}:`, file.name, file.type, file.size);
        formData.append("images", file); // Backend expect field name "images"
      });
    }

    // Debug: Log tất cả entries trong formData
    console.log("=== FORMDATA ENTRIES ===");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
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
                              [cost]: Number.parseInt(e.target.value),
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Phần quản lý ảnh được cải thiện */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quản lý ảnh
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowImageInfo(!showImageInfo)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Info className="w-4 h-4 mr-1" />
                    Thông tin
                  </button>
                </div>

                {/* Thông báo hướng dẫn */}
                {showImageInfo && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-1">
                          Lưu ý về quản lý ảnh:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Ảnh hiện tại sẽ được giữ nguyên</li>
                          <li>Bạn chỉ có thể thêm ảnh mới vào bài đăng</li>
                          <li>
                            Tính năng xóa ảnh cũ sẽ được cập nhật trong phiên
                            bản tiếp theo
                          </li>
                          <li>Ảnh mới sẽ được thêm vào cuối danh sách</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hiển thị ảnh hiện tại */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Ảnh hiện tại ({editedListing.images?.length || 0} ảnh)
                  </h4>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {editedListing.images?.map((image, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        {image &&
                        image.url &&
                        typeof image.url === "string" &&
                        image.url.toLowerCase().endsWith(".mp4") ? (
                          <video
                            src={image.url}
                            className="w-full h-24 object-cover rounded-md"
                            controls
                          />
                        ) : (
                          <img
                            src={
                              image && image.url
                                ? image.url
                                : "/placeholder.svg?height=100&width=100"
                            }
                            alt={`Ảnh ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            Ảnh cũ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hiển thị ảnh mới sẽ thêm */}
                {newImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-600 mb-2">
                      Ảnh mới sẽ thêm ({newImages.length} ảnh)
                    </h4>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {newImages.map((file, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <img
                            src={
                              URL.createObjectURL(file) || "/placeholder.svg"
                            }
                            alt={`Ảnh mới ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md border-2 border-green-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                            Mới
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input thêm ảnh mới */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                    key={newImages.length} // Force re-render when images change
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Plus className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">
                      Thêm ảnh mới
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      Chọn nhiều ảnh cùng lúc (JPG, PNG, MP4)
                    </span>
                  </label>

                  {/* Debug info */}
                  {newImages.length > 0 && (
                    <div className="mt-2 text-xs text-green-600">
                      ✓ Đã chọn {newImages.length} file
                    </div>
                  )}
                </div>

                {/* Alternative: Direct file input (for testing) */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hoặc chọn file trực tiếp (để test):
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center"
            >
              <span>Lưu thay đổi</span>
              {newImages.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  +{newImages.length} ảnh
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
