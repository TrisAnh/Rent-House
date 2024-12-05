import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");
  const [roomType, setRoomType] = useState("Single");
  const [area, setArea] = useState("");
  const [availability, setAvailability] = useState(true);
  const [electricityCost, setElectricityCost] = useState("");
  const [waterCost, setWaterCost] = useState("");
  const [internetCost, setInternetCost] = useState("");
  const [cleaningCost, setCleaningCost] = useState("");
  const [securityCost, setSecurityCost] = useState("");
  const [landlordId, setLandlordId] = useState(null);

  const [amenities, setAmenities] = useState({
    hasWifi: false,
    hasParking: false,
    hasAirConditioner: false,
    hasKitchen: false,
    hasElevator: false,
  });

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "https://be-android-project.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLandlordId(response.data._id);
      } else {
        alert("Token không tồn tại, vui lòng đăng nhập lại!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const handleImageSelect = (event) => {
    const files = event.target.files;
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages((prevImages) => [...prevImages, ...imageUrls]); // Thêm vào mảng cũ
    setImages((prevFiles) => [...prevFiles, ...Array.from(files)]); // Thêm vào mảng cũ
  };

  const handleToggleAmenity = (key) => {
    setAmenities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    if (!landlordId) {
      alert("Không thể lấy ID người cho thuê. Vui lòng thử lại!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append(
      "location",
      JSON.stringify({
        address,
        city,
        district,
        ward,
      })
    );
    formData.append("landlord", landlordId);
    formData.append("roomType", roomType);
    formData.append("size", area);
    formData.append("availability", availability);
    formData.append("amenities", JSON.stringify(amenities));
    formData.append(
      "additionalCosts",
      JSON.stringify({
        electricity: electricityCost,
        water: waterCost,
        internet: internetCost,
        cleaningService: cleaningCost,
        security: securityCost,
      })
    );

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]); // Append trực tiếp File object
    }

    for (let i = 0; i < videos.length; i++) {
      formData.append("videos", videos[i]);
    }

    try {
      const response = await fetch(
        "https://be-android-project.onrender.com/api/post/create",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Tạo bài viết thành công!");
        // Reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setAddress("");
        setDistrict("");
        setWard("");
        setCity("");
        setRoomType("Single");
        setArea("");
        setAvailability(true);
        setAmenities({
          hasWifi: false,
          hasParking: false,
          hasAirConditioner: false,
          hasKitchen: false,
          hasElevator: false,
        });
        setElectricityCost("");
        setWaterCost("");
        setInternetCost("");
        setCleaningCost("");
        setSecurityCost("");
        setImages([]);
        setVideos([]);
      } else {
        const errorText = await response.text();
        alert(`Lỗi: ${errorText}`);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi gọi API.");
      console.error("Network Error:", error);
    }
  };

  const handleVideoSelect = (event) => {
    const files = event.target.files;
    const videoUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedVideos((prevVideos) => [...prevVideos, ...videoUrls]); // Thêm vào mảng cũ
    setVideos((prevFiles) => [...prevFiles, ...Array.from(files)]); // Thêm vào mảng cũ
  };

  const removeVideo = (index) => {
    const updatedVideos = selectedVideos.filter((_, i) => i !== index);
    setSelectedVideos(updatedVideos);
    const updatedVideoFiles = videos.filter((_, i) => i !== index);
    setVideos(updatedVideoFiles);
  };

  const removeImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  return (
    <div className="add-listing-form">
      <h1>Đăng tin</h1>

      <label>Tiêu đề</label>
      <input
        type="text"
        placeholder="Nhập tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Mô tả</label>
      <textarea
        placeholder="Nhập mô tả chi tiết"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Giá</label>
      <input
        type="number"
        placeholder="Nhập giá"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label>Diện tích (m²)</label>
      <input
        type="number"
        placeholder="Nhập diện tích"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      />

      <label>Địa chỉ</label>
      <input
        type="text"
        placeholder="Nhập địa chỉ"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <label>Quận</label>
      <input
        type="text"
        placeholder="Nhập quận"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
      />

      <label>Phường</label>
      <input
        type="text"
        placeholder="Nhập phường"
        value={ward}
        onChange={(e) => setWard(e.target.value)}
      />

      <label>Thành phố</label>
      <input
        type="text"
        placeholder="Nhập thành phố"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <label>Loại phòng</label>
      <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
        <option value="Shared">Shared</option>
        <option value="Apartment">Apartment</option>
        <option value="Dormitory">Dormitory</option>
      </select>

      <div className="form-section">
        <h2>Chi phí hàng tháng</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Tiền điện (VNĐ/kWh)</label>
            <input
              type="number"
              placeholder="Nhập giá điện"
              value={electricityCost}
              onChange={(e) => setElectricityCost(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Tiền nước (VNĐ/m³)</label>
            <input
              type="number"
              placeholder="Nhập giá nước"
              value={waterCost}
              onChange={(e) => setWaterCost(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Internet (VNĐ/tháng)</label>
            <input
              type="number"
              placeholder="Nhập phí internet"
              value={internetCost}
              onChange={(e) => setInternetCost(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Dọn dẹp (VNĐ/tháng)</label>
            <input
              type="number"
              placeholder="Nhập phí dọn dẹp"
              value={cleaningCost}
              onChange={(e) => setCleaningCost(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Bảo vệ (VNĐ/tháng)</label>
          <input
            type="number"
            placeholder="Nhập phí bảo vệ"
            value={securityCost}
            onChange={(e) => setSecurityCost(e.target.value)}
          />
        </div>
      </div>

      <div className="amenities">
        <h3>Tiện ích</h3>
        <label>
          <input
            type="checkbox"
            checked={amenities.hasWifi}
            onChange={() => handleToggleAmenity("hasWifi")}
          />
          Wifi
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.hasParking}
            onChange={() => handleToggleAmenity("hasParking")}
          />
          Chỗ đỗ xe
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.hasAirConditioner}
            onChange={() => handleToggleAmenity("hasAirConditioner")}
          />
          Điều hòa
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.hasKitchen}
            onChange={() => handleToggleAmenity("hasKitchen")}
          />
          Bếp
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.hasElevator}
            onChange={() => handleToggleAmenity("hasElevator")}
          />
          Thang máy
        </label>
      </div>

      <div className="media-upload">
        <label>Hình ảnh phòng trọ</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
        />

        <div className="media-preview">
          {/* Hiển thị ảnh đã chọn */}
          {selectedImages.length > 0 && (
            <div>
              <h4>Hình ảnh đã chọn</h4>
              {selectedImages.map((imageUrl, index) => (
                <div key={index}>
                  <img
                    src={imageUrl}
                    alt={`image-${index}`}
                    width="100"
                    height="100"
                  />
                  <button onClick={() => removeImage(index)}>Xóa</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <label>Video phòng trọ</label>
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoSelect}
        />
        <div className="media-preview">
          {selectedVideos.length > 0 && (
            <div>
              <h4>Video đã chọn</h4>
              {selectedVideos.map((videoUrl, index) => (
                <div key={index}>
                  <video width="200" controls>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button onClick={() => removeVideo(index)}>Xóa</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Đăng bài
      </button>
    </div>
  );
};

export default CreatePost;
