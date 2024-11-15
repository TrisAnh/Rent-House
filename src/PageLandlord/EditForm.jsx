import React, { useState, useEffect } from "react";
import { updatePostById, getPostById } from "../api/post";
import { useParams, useNavigate } from "react-router-dom";

const ListingEditForm = ({ isOpen, onClose }) => {
  const [editedListing, setEditedListing] = useState({
    title: "",
    description: "",
    price: "",
    size: "",
    roomType: "Single",
    location: { address: "", ward: "", district: "", city: "" },
    amenities: {
      hasWifi: false,
      hasAirConditioner: false,
      hasKitchen: false,
      hasParking: false,
      hasElevator: false,
    },
    additionalCosts: {
      electricity: "",
      water: "",
      internet: "",
      cleaning: "",
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPostById(id);
        if (response.status === 200) {
          setEditedListing(response.data);
        } else {
          setError("Không tìm thấy bài đăng.");
        }
      } catch (error) {
        setError("Có lỗi xảy ra, vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleSaveListing = async (updatedListing) => {
    try {
      const response = await updatePostById(id, updatedListing);
      if (response.status === 200) {
        alert("Cập nhật thành công!");
        navigate(`/listings/${id}`);
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setEditedListing((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [amenity]: !prev.amenities[amenity] },
    }));
  };

  const handleAdditionalCostChange = (cost, value) => {
    setEditedListing((prev) => ({
      ...prev,
      additionalCosts: { ...prev.additionalCosts, [cost]: value },
    }));
  };

  const handleLocationChange = (field, value) => {
    setEditedListing((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  //if (!isOpen) return null; // Ẩn form khi isOpen = false
  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        <h2 style={{ marginBottom: "20px" }}>Chỉnh sửa bài đăng</h2>
        <div style={{ display: "grid", gap: "16px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <label htmlFor="title">Tiêu đề</label>
            <input
              id="title"
              name="title"
              value={editedListing.title}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={editedListing.description}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", height: "100px" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <label htmlFor="price">Giá (VND)</label>
            <input
              id="price"
              name="price"
              type="number"
              value={editedListing.price}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <label htmlFor="size">Kích thước (m²)</label>
            <input
              id="size"
              name="size"
              type="number"
              value={editedListing.size}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <label htmlFor="roomType">Loại phòng</label>
            <select
              id="roomType"
              name="roomType"
              value={editedListing.roomType}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="studio">Studio</option>
              <option value="apartment">Căn hộ</option>
              <option value="house">Nhà riêng</option>
            </select>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              alignItems: "start",
              gap: "8px",
            }}
          >
            <label>Địa chỉ</label>
            <div style={{ display: "grid", gap: "8px" }}>
              <input
                placeholder="Địa chỉ"
                value={editedListing.location.address}
                onChange={(e) =>
                  handleLocationChange("address", e.target.value)
                }
                style={{ width: "100%", padding: "8px" }}
              />
              <input
                placeholder="Phường/Xã"
                value={editedListing.location.ward}
                onChange={(e) => handleLocationChange("ward", e.target.value)}
                style={{ width: "100%", padding: "8px" }}
              />
              <input
                placeholder="Quận/Huyện"
                value={editedListing.location.district}
                onChange={(e) =>
                  handleLocationChange("district", e.target.value)
                }
                style={{ width: "100%", padding: "8px" }}
              />
              <input
                placeholder="Thành phố"
                value={editedListing.location.city}
                onChange={(e) => handleLocationChange("city", e.target.value)}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              alignItems: "start",
              gap: "8px",
            }}
          >
            <label>Tiện nghi</label>
            <div style={{ display: "grid", gap: "8px" }}>
              {[
                "hasWifi",
                "hasAirConditioner",
                "hasKitchen",
                "hasParking",
                "hasElevator",
              ].map((amenity) => (
                <label
                  key={amenity}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={editedListing.amenities[amenity]}
                    onChange={() => handleAmenityChange(amenity)}
                    style={{ marginRight: "8px" }}
                  />
                  {amenity === "hasWifi"
                    ? "Wifi"
                    : amenity === "hasAirConditioner"
                    ? "Điều hòa"
                    : amenity === "hasKitchen"
                    ? "Bếp"
                    : amenity === "hasParking"
                    ? "Đỗ xe"
                    : "Thang máy"}
                </label>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr",
              alignItems: "start",
              gap: "8px",
            }}
          >
            <label>Chi phí thêm (VND)</label>
            <div style={{ display: "grid", gap: "8px" }}>
              {["electricity", "water", "internet", "cleaning"].map((cost) => (
                <input
                  key={cost}
                  placeholder={
                    cost === "electricity"
                      ? "Điện"
                      : cost === "water"
                      ? "Nước"
                      : cost === "internet"
                      ? "Internet"
                      : "Dọn dẹp"
                  }
                  type="number"
                  value={editedListing.additionalCosts[cost]}
                  onChange={(e) =>
                    handleAdditionalCostChange(cost, e.target.value)
                  }
                  style={{ width: "100%", padding: "8px" }}
                />
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => handleSaveListing(editedListing)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingEditForm;
