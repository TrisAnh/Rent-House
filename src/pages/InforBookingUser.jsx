import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Home, Check, X, User, MapPin, DollarSign, Phone, Mail, Square } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import {
  getRequestByUserId,
  updateRequest,
  updateDeleteRequest,
} from "../api/request";
import { getUserById } from "../api/users";
import { getPostById } from "../api/post";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingDetailsUser = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [newDate, setNewDate] = useState(null); // Thay đổi từ newDateTime thành newDate
  const [newTime, setNewTime] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!user || !user.id) return;

      try {
        const response = await getRequestByUserId(user.id);
        const bookingsWithDetails = await Promise.all(
          response.data.map(async (booking) => {
            try {
              const userRent = await getUserById(booking.id_user_rent);
              const post = await getPostById(booking.id_post);

              return {
                ...booking,
                userRentName: userRent?.data.username || "N/A",
                userRentPhone: userRent?.data.phone || "N/A",
                userRentEmail: userRent?.data.email || "N/A",
                postTitle: post?.data.title || "N/A",
                postId: post?.data._id,
                postPrice: post?.data.price || 0,
                postSize: post?.data.size || 0,
                postRoomType: post?.data.roomType || "N/A",
                postLocation: post?.data.location || {},
                postImages: post?.data.images || [],
                postAmenities: post?.data.amenities || {},
                postAdditionalCosts: post?.data.additionalCosts || {},
                landlordInfo: post?.data.landlord || {},
                postViews: post?.data.views || 0,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
              };
            } catch (error) {
              console.error("Error fetching booking details:", error);
              return { ...booking, userRentName: "Error", postTitle: "Error" };
            }
          })
        );
        setBookingData(bookingsWithDetails);
      } catch (err) {
        setError("Không thể tải thông tin đặt lịch.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [user]);

  // Helper functions
  const formatAddress = (location) => {
    if (!location) return "Chưa có thông tin";
    const { address, ward, district, city } = location;
    return `${address || ''}, ${ward || ''}, ${district || ''}, ${city || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatRoomType = (roomType) => {
    const typeMap = {
      'Single': 'Phòng đơn',
      'Double': 'Phòng đôi',
      'Shared': 'Phòng chia sẻ',
      'Studio': 'Studio',
      'Apartment': 'Căn hộ'
    };
    return typeMap[roomType] || roomType;
  };

  const getDaysAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusText = (status) => {
    const statusMap = {
      'Pending': 'Chờ xác nhận',
      'Accepted': 'Đã được chấp nhận',
      'Declined': 'Đã bị từ chối'
    };
    return statusMap[status] || status;
  };

  const renderAmenities = (amenities) => {
    const amenityList = [
      { key: 'hasWifi', label: 'WiFi', icon: '📶' },
      { key: 'hasParking', label: 'Chỗ đậu xe', icon: '🚗' },
      { key: 'hasAirConditioner', label: 'Điều hòa', icon: '❄️' },
      { key: 'hasKitchen', label: 'Bếp', icon: '🍳' },
      { key: 'hasElevator', label: 'Thang máy', icon: '🛗' }
    ];

    return amenityList
      .filter(amenity => amenities[amenity.key])
      .map(amenity => (
        <span key={amenity.key} className="amenity-tag">
          {amenity.icon} {amenity.label}
        </span>
      ));
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa yêu cầu này không?")) {
      try {
        await updateDeleteRequest(bookingId);
        setBookingData((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
        toast.success("Yêu cầu đã được xóa thành công.");
      } catch (error) {
        toast.error("Không thể xóa yêu cầu.");
      }
    }
  };

  const handleUpdate = (bookingId, currentDateTime) => {
    setIsUpdating(true);
    setUpdatingBookingId(bookingId);

    // Parse current datetime thành date và time riêng biệt
    const currentDate = new Date(currentDateTime);
    setNewDate(currentDate);

    // Format time thành HH:mm
    const timeString = currentDate.toTimeString().slice(0, 5);
    setNewTime(timeString);
  };

  const submitUpdate = async () => {
    if (!newDate || !newTime || !updatingBookingId) {
      toast.error("Vui lòng chọn ngày và giờ mới.");
      return;
    }

    // Validate date không được trong quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(newDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Không thể đặt lịch cho ngày trong quá khứ!");
      return;
    }

    try {
      // Combine date và time thành datetime
      const combinedDateTime = new Date(`${newDate.toISOString().split("T")[0]}T${newTime}`);
      const utcDateTime = combinedDateTime.toISOString();

      const response = await updateRequest(updatingBookingId, {
        date_time: utcDateTime,
      });

      if (response.status === 200) {
        setBookingData((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === updatingBookingId
              ? { ...booking, date_time: utcDateTime }
              : booking
          )
        );
        toast.success("Yêu cầu đã được cập nhật thành công.");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Không thể cập nhật yêu cầu.");
    } finally {
      // Reset form
      setIsUpdating(false);
      setUpdatingBookingId(null);
      setNewDate(null);
      setNewTime("");
    }
  };
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  const minDate = new Date();
  if (loading) return <div className="loading">⏳ Đang tải...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="container">
      <h2 className="header">Thông Tin Lịch Đặt Phòng Chi Tiết</h2>

      {bookingData.length > 0 ? (
        <div className="booking-list">
          {bookingData.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                {booking.postImages && booking.postImages.length > 0 && (
                  <div className="post-image">
                    <img
                      src={booking.postImages[0].url}
                      alt={booking.postTitle}
                      className="header-image"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                )}
                <div className="header-content">
                  <Link
                    to={`/listings/${booking.postId}`}
                    className="booking-title"
                  >
                    <Home className="icon" />
                    {booking.postTitle}
                  </Link>
                  <p className="booking-id">Mã đặt lịch: #{booking._id.slice(-8)}</p>
                  <div className="quick-stats">
                    <span className="stat-item">👁️ {booking.postViews} lượt xem</span>
                  </div>
                </div>
              </div>

              <div className="booking-content">
                {/* Thông tin đặt lịch */}
                <div className="info-section">
                  <h4 className="section-title">📅 Thông tin đặt lịch</h4>
                  <div className="info-grid">
                    <p className="booking-info">
                      <Calendar className="icon" />
                      <span>
                        <strong>Ngày và Giờ Hẹn:</strong><br />
                        {new Date(booking.date_time).toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          weekday: "long"
                        })}
                      </span>
                    </p>
                    <p className="booking-info">
                      <Clock className="icon" />
                      <span>
                        <strong>Đã tạo:</strong><br />
                        {getDaysAgo(booking.createdAt)} ngày trước
                      </span>
                    </p>
                    <p className="booking-info status-info">
                      <strong>Trạng thái:</strong>
                      <span className={`status ${booking.status.toLowerCase()}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Thông tin chủ trọ */}
                {booking.landlordInfo && (
                  <div className="info-section">
                    <h4 className="section-title">👤 Thông tin chủ trọ</h4>
                    <div className="landlord-info">
                      <div className="landlord-details">
                        <p className="booking-info">
                          <User className="icon" />
                          <span><strong>Tên:</strong> {booking.landlordInfo.username || "N/A"}</span>
                        </p>
                        <p className="booking-info">
                          <Phone className="icon" />
                          <span>
                            <strong>Số điện thoại:</strong>
                            <a href={`tel:${booking.landlordInfo.phone}`} className="contact-link">
                              {booking.landlordInfo.phone || "N/A"}
                            </a>
                          </span>
                        </p>
                        <p className="booking-info">
                          <Mail className="icon" />
                          <span>
                            <strong>Email:</strong>
                            <a href={`mailto:${booking.landlordInfo.email}`} className="contact-link">
                              {booking.landlordInfo.email || "N/A"}
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ghi chú */}
                {booking.note && (
                  <div className="info-section">
                    <h4 className="section-title">📝 Ghi chú</h4>
                    <p className="booking-note">{booking.note}</p>
                  </div>
                )}
              </div>

              <div className="booking-actions">
                {booking.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleUpdate(booking._id, booking.date_time)}
                      className="btn btn-accept"
                    >
                      <Check className="icon" />
                      Cập nhật thời gian
                    </button>
                    <p className="status-message">⏳ Đang chờ chủ trọ xác nhận</p>
                  </>
                )}
                {booking.status === "Accepted" && (
                  <>
                    <p className="status-message success">✅ Đã được chấp nhận. Hãy liên hệ chủ trọ để xem phòng.</p>
                  </>
                )}
                {booking.status === "Declined" && (
                  <p className="status-message declined">❌ Đã bị từ chối. Bạn có thể tìm phòng khác hoặc liên hệ chủ trọ.</p>
                )}
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="btn btn-reject"
                >
                  <X className="icon" />
                  Xoá yêu cầu
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-bookings">
          <div className="no-bookings-icon">📅</div>
          <h3>Chưa có lịch đặt phòng nào</h3>
          <p>Bạn chưa đặt lịch xem phòng nào. Hãy tìm kiếm và đặt lịch xem phòng ngay!</p>
          <Link to="/" className="btn btn-primary">
            <Home className="icon" />
            Tìm phòng trọ ngay
          </Link>
        </div>
      )}

      {/* Update Form Modal */}
      {isUpdating && (
        <div className="update-form-overlay">
          <div className="update-form">
            <button
              className="close-modal-btn"
              onClick={() => {
                setIsUpdating(false);
                setUpdatingBookingId(null);
                setNewDate(null);
                setNewTime("");
              }}
            >
              ✕
            </button>

            <h3>🔄 Cập nhật lịch hẹn</h3>
            <p>Chọn ngày và giờ mới cho cuộc hẹn:</p>

            {/* Date Picker giống BookingForm */}
            <div className="form-group">
              <label className="form-label">Chọn ngày:</label>
              <DatePicker
                selected={newDate}
                onChange={(date) => setNewDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày (từ hôm nay)"
                customInput={
                  <input className="datetime-input" />
                }
                minDate={minDate}
                filterDate={(date) => !isDateDisabled(date)}
              />
            </div>

            {/* Time Select giống BookingForm */}
            <div className="form-group">
              <label className="form-label">Chọn giờ:</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="datetime-input"
              >
                <option value="">Chọn giờ</option>
                <option value="08:00">08:00 - Sáng</option>
                <option value="08:30">08:30 - Sáng</option>
                <option value="09:00">09:00 - Sáng</option>
                <option value="09:30">09:30 - Sáng</option>
                <option value="10:00">10:00 - Sáng</option>
                <option value="10:30">10:30 - Sáng</option>
                <option value="11:00">11:00 - Sáng</option>
                <option value="11:30">11:30 - Sáng</option>
                <option value="13:00">13:00 - Chiều</option>
                <option value="13:30">13:30 - Chiều</option>
                <option value="14:00">14:00 - Chiều</option>
                <option value="14:30">14:30 - Chiều</option>
                <option value="15:00">15:00 - Chiều</option>
                <option value="15:30">15:30 - Chiều</option>
                <option value="16:00">16:00 - Chiều</option>
                <option value="16:30">16:30 - Chiều</option>
                <option value="17:00">17:00 - Chiều</option>
                <option value="17:30">17:30 - Chiều</option>
                <option value="18:00">18:00 - Tối</option>
                <option value="18:30">18:30 - Tối</option>
                <option value="19:00">19:00 - Tối</option>
                <option value="19:30">19:30 - Tối</option>
                <option value="20:00">20:00 - Tối</option>
              </select>
            </div>

            {/* Preview thời gian đã chọn */}
            {newDate && newTime && (
              <div className="time-preview">
                <div className="preview-icon">📅</div>
                <div className="preview-content">
                  <p><strong>Lịch hẹn mới:</strong></p>
                  <p className="preview-datetime">
                    {newDate.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} - {newTime}
                  </p>
                </div>
              </div>
            )}

            <div className="update-form-actions">
              <button
                onClick={submitUpdate}
                className="btn btn-accept"
                disabled={!newDate || !newTime}
              >
                <Check className="icon" />
                Xác nhận
              </button>
              <button
                onClick={() => {
                  setIsUpdating(false);
                  setUpdatingBookingId(null);
                  setNewDate(null);
                  setNewTime("");
                }}
                className="btn btn-reject"
              >
                <X className="icon" />
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .header {
          font-size: 32px;
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .booking-list {
          display: grid;
          gap: 25px;
        }

        .booking-card {
          background-color: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }

        .booking-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .booking-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-image {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
          border: 3px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .header-content {
          flex: 1;
          min-width: 0;
        }

        .booking-title {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          transition: opacity 0.2s ease;
        }

        .booking-title:hover {
          opacity: 0.8;
        }

        .booking-id {
          font-size: 14px;
          opacity: 0.9;
          margin: 0 0 8px 0;
        }

        .quick-stats {
          display: flex;
          gap: 15px;
          font-size: 12px;
          opacity: 0.9;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .booking-content {
          padding: 25px;
        }

        .info-section {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .info-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 20px;
        }

        .section-title::before {
          content: '';
          position: absolute;
          left: 0;
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .booking-info {
          margin: 0;
          font-size: 15px;
          display: flex;
          align-items: flex-start;
          color: #495057;
          line-height: 1.5;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border-left: 3px solid #667eea;
        }

        .status-info {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .icon {
          margin-right: 12px;
          color: #667eea;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contact-link {
          color: #667eea;
          text-decoration: none;
          margin-left: 8px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .contact-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .amenities-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .amenity-tag {
          background: linear-gradient(135deg, #667eea20, #764ba220);
          color: #667eea;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #667eea30;
        }

        .costs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .cost-item {
          background-color: #f8f9fa;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          color: #495057;
          border-left: 3px solid #28a745;
        }

        .landlord-info {
          background-color: #f8f9fa;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .landlord-details {
          display: grid;
          gap: 12px;
        }

        .booking-note {
          background-color: #fff3cd;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #ffc107;
          font-style: italic;
          margin: 0;
          color: #856404;
        }

        .status {
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status.pending {
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }

        .status.accepted {
          background-color: #d1e7dd;
          color: #0f5132;
          border: 1px solid #a3cfbb;
        }

        .status.declined {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f1aeb5;
        }

        .booking-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          background-color: #f8f9fa;
          gap: 15px;
          flex-wrap: wrap;
          border-top: 1px solid #e9ecef;
        }

        .contact-buttons {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          text-decoration: none;
          justify-content: center;
        }

        .btn-accept {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: #fff;
        }

        .btn-accept:hover {
          background: linear-gradient(135deg, #20c997, #17a2b8);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }

        .btn-reject {
          background: linear-gradient(135deg, #dc3545, #e74c3c);
          color: #fff;
        }

        .btn-reject:hover {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .btn-contact {
          background: linear-gradient(135deg, #17a2b8, #138496);
          color: #fff;
        }

        .btn-contact:hover {
          background: linear-gradient(135deg, #138496, #117a8b);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          padding: 16px 32px;
          font-size: 16px;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #764ba2, #667eea);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .status-message {
          font-style: italic;
          color: #6c757d;
          margin: 0;
          flex: 1;
          font-size: 14px;
          line-height: 1.4;
        }

        .status-message.success {
          color: #28a745;
          font-weight: 500;
        }

        .status-message.declined {
          color: #dc3545;
          font-weight: 500;
        }

        .no-bookings {
          text-align: center;
          padding: 60px 20px;
          background-color: #fff;
          border-radius: 16px;
          border: 2px dashed #dee2e6;
          margin-top: 20px;
        }

        .no-bookings-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .no-bookings h3 {
          color: #495057;
          margin-bottom: 12px;
          font-size: 24px;
        }

        .no-bookings p {
          font-size: 16px;
          color: #6c757d;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .loading,
        .error {
          text-align: center;
          font-size: 18px;
          margin-top: 40px;
          padding: 20px;
          border-radius: 8px;
        }

        .loading {
          color: #667eea;
          background-color: #f0f4ff;
        }

        .error {
          color: #dc3545;
          background-color: #fff5f5;
        }

        .update-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .update-form {
          background-color: #fff;
          padding: 30px;
          border-radius: 16px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .update-form h3 {
          margin-bottom: 16px;
          text-align: center;
          color: #2c3e50;
          font-size: 20px;
        }

        .update-form p {
          margin-bottom: 16px;
          color: #6c757d;
          text-align: center;
        }

        .datetime-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 20px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .datetime-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .update-form-actions {
          display: flex;
          gap: 12px;
        }

        .update-form-actions .btn {
          flex: 1;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
          
          .booking-header {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .header-image {
            width: 60px;
            height: 60px;
          }
          
          .booking-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .btn {
            width: 100%;
            margin-bottom: 8px;
          }

          .contact-buttons {
            width: 100%;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .costs-grid {
            grid-template-columns: 1fr;
          }

          .quick-stats {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .header {
            font-size: 24px;
          }

          .booking-title {
            font-size: 18px;
          }

          .booking-content {
            padding: 20px;
          }

          /* Thêm vào cuối style tag */

.update-form {
  background-color: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.close-modal-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-modal-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.update-form h3 {
  margin-bottom: 12px;
  text-align: center;
  color: #2c3e50;
  font-size: 20px;
  padding-right: 40px;
}

.update-form p {
  margin-bottom: 20px;
  color: #6c757d;
  text-align: center;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.datetime-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.datetime-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.datetime-input:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.time-preview {
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border: 1px solid #667eea30;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
}

.preview-content p {
  margin: 0;
  font-size: 13px;
  color: #495057;
}

.preview-content p:first-child {
  font-weight: 600;
  margin-bottom: 4px;
}

.preview-datetime {
  color: #667eea;
  font-weight: 500;
  font-size: 14px;
}

.update-form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.update-form-actions .btn {
  flex: 1;
  justify-content: center;
  transition: all 0.3s ease;
}

.update-form-actions .btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.update-form-actions .btn:disabled:hover {
  background: #e9ecef;
  transform: none;
  box-shadow: none;
}

/* Custom DatePicker styles */
.react-datepicker-wrapper {
  width: 100%;
}

.react-datepicker__input-container {
  width: 100%;
}

.react-datepicker__input-container input {
  width: 100%;
}

.react-datepicker {
  border: 2px solid #667eea;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.react-datepicker__header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-bottom: none;
  border-radius: 6px 6px 0 0;
}

.react-datepicker__current-month,
.react-datepicker__day-name {
  color: white;
}

.react-datepicker__day--selected,
.react-datepicker__day--keyboard-selected {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
}

.react-datepicker__day:hover {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
}

.react-datepicker__day--disabled {
  color: #ccc;
}

.react-datepicker__navigation {
  top: 13px;
}

.react-datepicker__navigation--previous {
  border-right-color: white;
}

.react-datepicker__navigation--next {
  border-left-color: white;
}

/* Mobile responsive cho update form */
@media (max-width: 768px) {
  .update-form {
    width: 95%;
    margin: 20px;
    padding: 20px;
    max-height: 85vh;
  }

  .update-form h3 {
    font-size: 18px;
    padding-right: 35px;
  }

  .time-preview {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .preview-content {
    width: 100%;
  }

  .update-form-actions {
    flex-direction: column;
  }

  .update-form-actions .btn {
    width: 100%;
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .datetime-input {
    padding: 10px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .form-label {
    font-size: 13px;
  }

  .preview-datetime {
    font-size: 13px;
  }
}
        }
      `}</style>
    </div>
  );
};

export default BookingDetailsUser;