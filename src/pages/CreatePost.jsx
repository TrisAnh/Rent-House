"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [showWarnings, setShowWarnings] = useState(false);
  const [apiWarnings, setApiWarnings] = useState([]);
  const [priceEvaluation, setPriceEvaluation] = useState(null);
  const [duplicateImages, setDuplicateImages] = useState([]);
  const [pendingPostData, setPendingPostData] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingWarnings, setPendingWarnings] = useState([]);
  const [pendingPriceEvaluation, setPendingPriceEvaluation] = useState(null);
  const [pendingDuplicateImages, setPendingDuplicateImages] = useState([]);

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
      formDataToSend.append("price", parseInt(formData.price));
      formDataToSend.append("size", parseInt(formData.area));
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

      // Thêm flag để check warnings trước
      formDataToSend.append("checkOnly", "true");

      console.log("Checking for warnings...");
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/post/create",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      console.log("Response status:", response.status);

      const responseData = await response.json();

      if (response.ok) {
        // Nếu có warnings, hiển thị dialog xác nhận
        if (responseData.warnings && responseData.warnings.length > 0) {
          setPendingWarnings(responseData.warnings);
          setPendingPriceEvaluation(responseData.priceEvaluation);
          setPendingDuplicateImages(responseData.imageCheck?.duplicateDetails || []);

          // Tạo FormData mới không có checkOnly flag
          const finalFormData = new FormData();
          for (let [key, value] of formDataToSend.entries()) {
            if (key !== 'checkOnly') {
              finalFormData.append(key, value);
            }
          }
          setPendingPostData(finalFormData);
          setShowConfirmDialog(true);
        } else {
          // Không có warnings, đăng bài thành công
          toast.success("Tạo bài viết thành công!");
          resetForm();
        }
      } else {
        console.error("API error:", responseData);
        setError(`Lỗi: ${responseData.message || "Không thể tạo bài đăng"}`);
        toast.error(`Lỗi: ${responseData.message || "Không thể tạo bài đăng"}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi bài đăng:", error);
      setError("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại sau.");
      toast.error("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại sau.");
    }
  };

  // Thêm sau hàm handleSubmit:

  // Hàm xác nhận đăng bài với warnings
  const confirmPostWithWarnings = async () => {
    try {
      const token = localStorage.getItem("token");

      // Thêm confirmWarnings flag
      pendingPostData.append("confirmWarnings", "true");

      const response = await fetch(
        "http://localhost:5000/api/post/create",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: pendingPostData,
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Tạo bài viết thành công!");
        setShowConfirmDialog(false);
        setPendingWarnings([]);
        setPendingPostData(null);
        setPendingPriceEvaluation(null);
        setPendingDuplicateImages([]);
        resetForm();
      } else {
        setError(`Lỗi: ${responseData.message || "Không thể tạo bài đăng"}`);
        toast.error(`Lỗi: ${responseData.message || "Không thể tạo bài đăng"}`);
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận đăng bài:", error);
      setError("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại sau.");
      toast.error("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại sau.");
    }
  };

  // Hàm hủy đăng bài
  const cancelPost = () => {
    setShowConfirmDialog(false);
    setPendingWarnings([]);
    setPendingPostData(null);
    setPendingPriceEvaluation(null);
    setPendingDuplicateImages([]);
  };

  // Cập nhật hàm resetForm
  const resetForm = () => {
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
    setError("");
    setShowWarnings(false);
    setApiWarnings([]);
    setPriceEvaluation(null);
    setDuplicateImages([]);
  };

  return (
    <PageWrapper>
      <Container>
        <ToastContainer />

        {/* Dialog xác nhận warnings */}
        {showConfirmDialog && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{
                color: '#f56565',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '22px',
                fontWeight: 'bold'
              }}>
                ⚠️ Phát hiện cảnh báo về bài đăng
              </h3>

              <p style={{ marginBottom: '20px', color: '#4a5568', fontSize: '16px' }}>
                Hệ thống phát hiện một số vấn đề với bài đăng của bạn:
              </p>

              {/* Danh sách warnings */}
              <div style={{
                backgroundColor: '#fff5f5',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #fed7d7'
              }}>
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px',
                  color: '#2d3748'
                }}>
                  {pendingWarnings.map((warning, index) => (
                    <li key={index} style={{ marginBottom: '8px', fontSize: '15px' }}>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Thông tin đánh giá giá */}
              {pendingPriceEvaluation && (
                <div style={{
                  backgroundColor: pendingPriceEvaluation.level === 'high' ? '#fef5e7' :
                    pendingPriceEvaluation.level === 'low' ? '#e6fffa' : '#f0fff4',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  border: `1px solid ${pendingPriceEvaluation.level === 'high' ? '#fbd38d' :
                    pendingPriceEvaluation.level === 'low' ? '#81e6d9' : '#9ae6b4'}`
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>💰 Chi tiết đánh giá giá:</h4>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>
                    <strong>Mức độ:</strong> {
                      pendingPriceEvaluation.level === 'high' ? '🔴 Cao hơn thị trường' :
                        pendingPriceEvaluation.level === 'low' ? '🔵 Thấp hơn thị trường' :
                          '🟢 Phù hợp với thị trường'
                    }
                  </p>
                  {pendingPriceEvaluation.predictedPrice && (
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>
                      <strong>Giá dự đoán:</strong> {pendingPriceEvaluation.predictedPrice.toLocaleString()} VNĐ
                    </p>
                  )}
                </div>
              )}

              {/* Thông tin ảnh trùng lặp */}
              {pendingDuplicateImages.length > 0 && (
                <div style={{
                  backgroundColor: '#fff5f5',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  border: '1px solid #fed7d7'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🚨 Chi tiết ảnh trùng lặp:</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {pendingDuplicateImages.map((duplicate, index) => (
                      <li key={index} style={{ marginBottom: '5px', fontSize: '14px' }}>
                        Trùng với bài đăng ID: <strong>{duplicate.matchedPostId}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{
                backgroundColor: '#fff8e1',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '25px',
                border: '1px solid #ffecb3'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#e65100',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  <strong>⚠️ Lưu ý quan trọng:</strong> Nếu bạn tiếp tục đăng bài, những cảnh báo này sẽ được hiển thị
                  dưới dạng nhãn cảnh báo trên bài đăng để người thuê có thể nhận biết.
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={cancelPost}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#cbd5e0'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmPostWithWarnings}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f56565',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#e53e3e'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#f56565'}
                >
                  Vẫn đăng bài
                </button>
              </div>
            </div>
          </div>
        )}
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
