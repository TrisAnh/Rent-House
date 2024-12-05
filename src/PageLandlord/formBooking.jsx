import React, { useEffect, useState } from "react";
import { X, Trash2, Check, XIcon, AlertCircle } from "lucide-react";
import { getUserById } from "../api/users";
import { updateDeleteRequest } from "../api/request";

const BookingModal = ({
  isOpen,
  onClose,
  bookingInfo,
  bookingRequests = [],
  onAccept,
  onReject,
}) => {
  const [userRentInfo, setUserRentInfo] = useState({});
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserInfo = async (userId) => {
    if (!userId) return;
    try {
      const response = await getUserById(userId);
      setUserRentInfo((prevInfo) => ({
        ...prevInfo,
        [userId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    setError(null);
    if (bookingRequests.length === 0) {
      setError("Không có yêu cầu đặt phòng nào.");
      return;
    }
    bookingRequests.forEach((request) => {
      if (request.id_user_rent && !userRentInfo[request.id_user_rent]) {
        fetchUserInfo(request.id_user_rent);
      } else if (!request.id_user_rent) {
        console.warn(`Missing id_user_rent for request: ${request._id}`);
      }
    });
  }, [bookingRequests, userRentInfo]);

  const handleDelete = async (requestId) => {
    try {
      await updateDeleteRequest(requestId);
      showNotification("Yêu cầu đặt phòng đã được xóa thành công", "success");
      // You might want to update the bookingRequests state here
      // or trigger a re-fetch of the requests
    } catch (error) {
      console.error("Error deleting booking request:", error);
      showNotification(
        "Không thể xóa yêu cầu đặt phòng. Vui lòng thử lại!",
        "error"
      );
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await onAccept(requestId);
      showNotification(
        "Yêu cầu đặt phòng đã được chấp nhận thành công",
        "success"
      );
    } catch (error) {
      console.error("Error accepting booking request:", error);
      showNotification(
        "Không thể chấp nhận yêu cầu đặt phòng. Vui lòng thử lại!",
        "error"
      );
    }
  };

  const handleReject = async (requestId) => {
    try {
      await onReject(requestId);
      showNotification(
        "Yêu cầu đặt phòng đã được từ chối thành công",
        "success"
      );
    } catch (error) {
      console.error("Error rejecting booking request:", error);
      showNotification(
        "Không thể từ chối yêu cầu đặt phòng. Vui lòng thử lại!",
        "error"
      );
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Thông tin đặt phòng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {notification && (
          <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 p-3 rounded-md shadow-md ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : notification.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="mb-6 bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2 text-gray-700">
            Thông tin bài viết:
          </h3>
          <p className="text-gray-600">
            <span className="font-medium">Tiêu đề:</span> {bookingInfo.title}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Địa chỉ:</span> {bookingInfo.address}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">
            Danh sách yêu cầu đặt lịch:
          </h3>
          {error ? (
            <div className="flex items-center justify-center p-4 bg-yellow-100 text-yellow-700 rounded-md">
              <AlertCircle size={20} className="mr-2" />
              <p>{error}</p>
            </div>
          ) : bookingRequests.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              Không có yêu cầu đặt lịch nào.
            </p>
          ) : (
            bookingRequests.map((request) => (
              <div
                key={request._id}
                className="border border-gray-200 p-4 rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-700">
                    Yêu cầu đặt lịch:
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(request.date_time).toLocaleString()}
                  </p>
                </div>

                {request.id_user_rent ? (
                  userRentInfo[request.id_user_rent] ? (
                    <div className="mb-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Tên:</span>{" "}
                        {userRentInfo[request.id_user_rent].username}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {userRentInfo[request.id_user_rent].email}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Đang tải thông tin người thuê...
                    </p>
                  )
                ) : (
                  <p className="text-gray-500 italic">
                    Không có thông tin người đặt lịch.
                  </p>
                )}

                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Trạng thái:</span>{" "}
                  <span
                    className={`font-semibold ${
                      request.status === "Pending"
                        ? "text-yellow-600"
                        : request.status === "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </p>

                <div className="flex justify-end space-x-2">
                  {request.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
                      >
                        <XIcon size={16} className="mr-1" /> Từ chối
                      </button>
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                      >
                        <Check size={16} className="mr-1" /> Chấp nhận
                      </button>
                    </>
                  )}
                  {request.status !== "Pending" && (
                    <button
                      onClick={() => handleDelete(request._id)}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" /> Xóa
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
