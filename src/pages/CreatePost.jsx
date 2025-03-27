"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  PageWrapper,
  FormCard,
  FormTitle,
  FormSection,
  SectionTitle,
  FormRow,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  AmenitiesGrid,
  AmenityItem,
  MediaUploadSection,
  MediaPreview,
  MediaItem,
  SubmitButton,
  ErrorAlert,
  FormDivider,
  IconWrapper,
} from "./CreatePostStyles";
import {
  FaWifi,
  FaParking,
  FaSnowflake,
  FaUtensils,
  FaBuilding,
} from "react-icons/fa";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    district: "",
    ward: "",
    city: "",
    roomType: "Single",
    area: "",
    availability: true,
    electricityCost: "",
    waterCost: "",
    internetCost: "",
    cleaningCost: "",
    securityCost: "",
    amenities: {
      hasWifi: false,
      hasParking: false,
      hasAirConditioner: false,
      hasKitchen: false,
      hasElevator: false,
    },
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [landlordId, setLandlordId] = useState(null);
  const [error, setError] = useState("");

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
        setError("Token không tồn tại, vui lòng đăng nhập lại!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      setError("Không thể lấy thông tin người dùng. Vui lòng thử lại sau.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (key) => {
    setFormData((prevState) => ({
      ...prevState,
      amenities: {
        ...prevState.amenities,
        [key]: !prevState.amenities[key],
      },
    }));
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleVideoSelect = (event) => {
    const files = Array.from(event.target.files);
    setVideos((prevVideos) => [...prevVideos, ...files]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!landlordId) {
      setError("Không thể lấy ID người cho thuê. Vui lòng thử lại!");
      return;
    }

    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("size", formData.area);
      formDataToSend.append("roomType", formData.roomType);
      formDataToSend.append("availability", formData.availability);
      formDataToSend.append("landlord", landlordId);

      // Structure location data as expected by the API
      const locationData = {
        address: formData.address,
        district: formData.district,
        ward: formData.ward,
        city: formData.city,
      };
      formDataToSend.append("location", JSON.stringify(locationData));

      // Structure additional costs
      const additionalCosts = {
        electricity: formData.electricityCost,
        water: formData.waterCost,
        internet: formData.internetCost,
        cleaningService: formData.cleaningCost,
        security: formData.securityCost,
      };
      formDataToSend.append("additionalCosts", JSON.stringify(additionalCosts));

      // Add amenities
      formDataToSend.append("amenities", JSON.stringify(formData.amenities));

      // Add media files
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      videos.forEach((video) => {
        formDataToSend.append("videos", video);
      });

      console.log("Sending data to API...");

      // Use fetch instead of axios for better multipart/form-data handling
      const response = await fetch(
        "https://be-android-project.onrender.com/api/post/create",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            // Don't set Content-Type header - let the browser set it with the boundary
          },
          body: formDataToSend,
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        alert("Tạo bài viết thành công!");
        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          address: "",
          district: "",
          ward: "",
          city: "",
          roomType: "Single",
          area: "",
          availability: true,
          electricityCost: "",
          waterCost: "",
          internetCost: "",
          cleaningCost: "",
          securityCost: "",
          amenities: {
            hasWifi: false,
            hasParking: false,
            hasAirConditioner: false,
            hasKitchen: false,
            hasElevator: false,
          },
        });
        setImages([]);
        setVideos([]);
      } else {
        console.error("API error:", responseData);
        setError(`Lỗi: ${responseData.message || "Không thể tạo bài đăng"}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi bài đăng:", error);
      setError("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại sau.");
    }
  };

  return (
    <PageWrapper>
      <Container>
        <FormCard onSubmit={handleSubmit}>
          <FormTitle>Đăng tin cho thuê</FormTitle>

          {error && <ErrorAlert>{error}</ErrorAlert>}

          <FormSection>
            <SectionTitle>Thông tin cơ bản</SectionTitle>
            <FormGroup>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder="Nhập tiêu đề bài đăng"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <TextArea
                id="description"
                name="description"
                placeholder="Mô tả chi tiết về phòng trọ/căn hộ của bạn"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="price">Giá thuê (VNĐ/tháng)</Label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="Ví dụ: 3,000,000"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="area">Diện tích (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  name="area"
                  placeholder="Ví dụ: 25"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="roomType">Loại phòng</Label>
              <Select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
              >
                <option value="Single">Phòng đơn</option>
                <option value="Double">Phòng đôi</option>
                <option value="Shared">Phòng ở ghép</option>
                <option value="Apartment">Căn hộ</option>
                <option value="Dormitory">Ký túc xá</option>
              </Select>
            </FormGroup>
          </FormSection>

          <FormDivider />

          <FormSection>
            <SectionTitle>Địa chỉ</SectionTitle>
            <FormGroup>
              <Label htmlFor="address">Địa chỉ cụ thể</Label>
              <Input
                id="address"
                type="text"
                name="address"
                placeholder="Số nhà, tên đường"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="ward">Phường/Xã</Label>
                <Input
                  id="ward"
                  type="text"
                  name="ward"
                  placeholder="Tên phường/xã"
                  value={formData.ward}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="district">Quận/Huyện</Label>
                <Input
                  id="district"
                  type="text"
                  name="district"
                  placeholder="Tên quận/huyện"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="city">Thành phố</Label>
              <Input
                id="city"
                type="text"
                name="city"
                placeholder="Tên thành phố"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </FormSection>

          <FormDivider />

          <FormSection>
            <SectionTitle>Chi phí hàng tháng</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="electricityCost">Tiền điện (VNĐ/kWh)</Label>
                <Input
                  id="electricityCost"
                  type="number"
                  name="electricityCost"
                  placeholder="Ví dụ: 3,500"
                  value={formData.electricityCost}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="waterCost">Tiền nước (VNĐ/m³)</Label>
                <Input
                  id="waterCost"
                  type="number"
                  name="waterCost"
                  placeholder="Ví dụ: 15,000"
                  value={formData.waterCost}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="internetCost">Internet (VNĐ/tháng)</Label>
                <Input
                  id="internetCost"
                  type="number"
                  name="internetCost"
                  placeholder="Ví dụ: 200,000"
                  value={formData.internetCost}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="cleaningCost">Dọn dẹp (VNĐ/tháng)</Label>
                <Input
                  id="cleaningCost"
                  type="number"
                  name="cleaningCost"
                  placeholder="Ví dụ: 100,000"
                  value={formData.cleaningCost}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="securityCost">Bảo vệ (VNĐ/tháng)</Label>
              <Input
                id="securityCost"
                type="number"
                name="securityCost"
                placeholder="Ví dụ: 50,000"
                value={formData.securityCost}
                onChange={handleInputChange}
              />
            </FormGroup>
          </FormSection>

          <FormDivider />

          <FormSection>
            <SectionTitle>Tiện ích</SectionTitle>
            <AmenitiesGrid>
              <AmenityItem
                active={formData.amenities.hasWifi}
                onClick={() => handleAmenityToggle("hasWifi")}
              >
                <IconWrapper active={formData.amenities.hasWifi}>
                  <FaWifi />
                </IconWrapper>
                <span>Wifi</span>
              </AmenityItem>

              <AmenityItem
                active={formData.amenities.hasParking}
                onClick={() => handleAmenityToggle("hasParking")}
              >
                <IconWrapper active={formData.amenities.hasParking}>
                  <FaParking />
                </IconWrapper>
                <span>Chỗ đỗ xe</span>
              </AmenityItem>

              <AmenityItem
                active={formData.amenities.hasAirConditioner}
                onClick={() => handleAmenityToggle("hasAirConditioner")}
              >
                <IconWrapper active={formData.amenities.hasAirConditioner}>
                  <FaSnowflake />
                </IconWrapper>
                <span>Điều hòa</span>
              </AmenityItem>

              <AmenityItem
                active={formData.amenities.hasKitchen}
                onClick={() => handleAmenityToggle("hasKitchen")}
              >
                <IconWrapper active={formData.amenities.hasKitchen}>
                  <FaUtensils />
                </IconWrapper>
                <span>Bếp</span>
              </AmenityItem>

              <AmenityItem
                active={formData.amenities.hasElevator}
                onClick={() => handleAmenityToggle("hasElevator")}
              >
                <IconWrapper active={formData.amenities.hasElevator}>
                  <FaBuilding />
                </IconWrapper>
                <span>Thang máy</span>
              </AmenityItem>
            </AmenitiesGrid>
          </FormSection>

          <FormDivider />

          <FormSection>
            <SectionTitle>Hình ảnh và Video</SectionTitle>
            <MediaUploadSection>
              <FormGroup>
                <Label htmlFor="images">Hình ảnh phòng trọ</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                />
                <p className="hint">
                  Chọn nhiều hình ảnh để hiển thị phòng trọ của bạn
                </p>
              </FormGroup>

              {images.length > 0 && (
                <MediaPreview>
                  {images.map((image, index) => (
                    <MediaItem key={`image-${index}`}>
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                      />
                      <button type="button" onClick={() => removeImage(index)}>
                        ×
                      </button>
                    </MediaItem>
                  ))}
                </MediaPreview>
              )}
            </MediaUploadSection>

            <MediaUploadSection>
              <FormGroup>
                <Label htmlFor="videos">Video phòng trọ</Label>
                <Input
                  id="videos"
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoSelect}
                />
                <p className="hint">
                  Thêm video để người thuê có cái nhìn tổng quan hơn
                </p>
              </FormGroup>

              {videos.length > 0 && (
                <MediaPreview>
                  {videos.map((video, index) => (
                    <MediaItem key={`video-${index}`} isVideo>
                      <video src={URL.createObjectURL(video)} controls />
                      <button type="button" onClick={() => removeVideo(index)}>
                        ×
                      </button>
                    </MediaItem>
                  ))}
                </MediaPreview>
              )}
            </MediaUploadSection>
          </FormSection>

          <SubmitButton type="submit">Đăng bài</SubmitButton>
        </FormCard>
      </Container>
    </PageWrapper>
  );
};

export default CreatePost;
