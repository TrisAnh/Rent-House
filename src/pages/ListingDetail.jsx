import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import styled from "styled-components";
import Slider from "react-slick";
import { getPostById } from "../api/post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faMapMarkerAlt,
  faDollarSign,
  faHouseUser,
  faWifi,
  faCar,
  faTemperatureHigh,
  faShower,
  faUtensils,
  faBolt,
  faTint,
  faTrashAlt,
  faStar,
  faEye,
  faElevator,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
// Thêm file CSS của slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Section,
  SliderContainer,
  Image,
  Video,
  Title,
  InfoText,
  DetailContainer,
  FavoriteButton,
  PriceText,
  IconWrapper,
  List,
  ListItem,
  ContactInfo,
  ContactContainer,
  ContactTitle,
  ContactText,
  BookButton,
  ContactName,
  MainContainer,
  Avatar,
  OnlineStatus,
  PhoneText,
  OnlineStatusWrapper,
  StatusText,
  BookingFormContainer,
  FormInput,
  FormLabel,
  CancelButton,
  FormButton,
} from "../styled/ListingDetailStyles";
import { useAuth } from "../hooks/useAuth";
import { getUserById } from "../api/users";
import ChatBox from "../pages/ChatBox"; // Thêm dòng này ở đầu file
import { createFavourite } from "../api/favourites"; // Import hàm createFavourite

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho Toastify
import RoomBookingForm from "./BookingRoom";
const ListingDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const { user, logout } = useAuth(); // Lấy thông tin từ context
  const [listing, setListing] = useState(null); // Trạng thái chứa dữ liệu bài đăng
  const [landlord, setLandlord] = useState(null); // Trạng thái chứa dữ liệu chủ trọ
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [isFavorited, setIsFavorited] = useState(false); // Trạng thái yêu thích
  const [showBookingForm, setShowBookingForm] = useState(false); // Trạng thái hiển thị form đặt lịch
  const [formData, setFormData] = useState({ subject: "", date: "", time: "" }); // Dữ liệu form
  const [notification, setNotification] = useState(""); // State cho thông báo
  const navigate = useNavigate(); // Khởi tạo useNavigate
  useEffect(() => {
    // Hàm fetch dữ liệu từ API
    const fetchListing = async () => {
      try {
        const response = await getPostById(id); // Lấy bài đăng theo ID
        setListing(response.data); // Lưu dữ liệu bài đăng
        console.log(response.data);
        if (response.data.landlord) {
          const landlordResponse = await getUserById(response.data.landlord);
          setLandlord(landlordResponse.data);

          console.log(landlordResponse);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing(); // Gọi hàm khi có ID
    }
  }, [id]); // Thực thi lại khi ID thay đổi

  const toggleFavorite = async () => {
    try {
      const id_user_rent = "60d0fe4f5311236168a109ca"; // ID của người dùng
      const id_post = "60d0fe4f5311236168a109cb"; // ID của bài đăng

      const response = await createFavourite(id_user_rent, id_post);
      console.log("Mục yêu thích đã được tạo:", response.data);
      setIsFavorited(!isFavorited);
      toast.success("Mục yêu thích đã được tạo thành công!"); // Hiển thị thông báo thành công
    } catch (err) {
      console.error("Lỗi khi thêm yêu thích:", err);
      toast.error("Lỗi khi thêm yêu thích!"); // Hiển thị thông báo lỗi
    }
  };
  const handleBookSchedule = () => {
    setShowBookingForm(true); // Hiển thị form đặt lịch
  };
  const handleNavigate = () => {
    navigate(`/booking/${id}`); // Chuyển đến trang mới với ID bài viết
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value })); // Cập nhật dữ liệu form
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(
      `Đặt lịch thành công với chủ đề: ${formData.subject}, Ngày: ${formData.date}, Giờ: ${formData.time}`
    );
    setShowBookingForm(false); // Ẩn form sau khi đặt lịch thành công
    setFormData({ subject: "", date: "", time: "" }); // Reset form
  };
  if (loading) return <p>Đang tải...</p>; // Hiển thị khi đang tải
  if (error) return <p>{error}</p>; // Hiển thị khi có lỗi
  const { phone, address, username, avatar, isOnline } = landlord || {};
  // Cấu hình của slider
  const settings = {
    dots: true, // Hiển thị chấm điều hướng
    infinite: true, // Lặp lại slider
    speed: 500, // Tốc độ chuyển đổi
    slidesToShow: 1, // Số lượng ảnh hiển thị tại một thời điểm
    slidesToScroll: 1, // Số lượng ảnh cuộn khi chuyển đổi
    autoplay: true, // Tự động chuyển đổi
    autoplaySpeed: 3000, // Tốc độ tự động chuyển đổi
  };

  return (
    <MainContainer>
      <DetailContainer>
        <Title>{listing.title}</Title>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <FavoriteButton onClick={toggleFavorite}>
            <FontAwesomeIcon
              icon={isFavorited ? faHeartSolid : faHeartRegular}
            />{" "}
            Yêu thích
          </FavoriteButton>
        </div>
        {/* Slider cho ảnh và video */}
        <SliderContainer>
          <Slider {...settings}>
            {/* Hiển thị ảnh trong slider */}
            {listing.images &&
              listing.images.map((image, index) => (
                <div key={index}>
                  <Image src={image} alt={`Image ${index + 1}`} />
                </div>
              ))}

            {/* Hiển thị video trong slider */}
            {listing.videos &&
              listing.videos.map((video, index) => (
                <div key={index}>
                  <Video controls>
                    <source src={video} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </Video>
                </div>
              ))}
          </Slider>
        </SliderContainer>
        <Section>
          <InfoText>{listing.description}</InfoText>
          <PriceText>
            <IconWrapper>
              <FontAwesomeIcon icon={faDollarSign} />
            </IconWrapper>
            Giá:{" "}
            {listing.price ? listing.price.toLocaleString() : "Chưa có giá"}{" "}
            VND/tháng
          </PriceText>
        </Section>

        <Section>
          <h4>
            <IconWrapper>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </IconWrapper>
            Vị trí
          </h4>
          <InfoText>
            <strong>Địa chỉ:</strong>{" "}
            {listing.location?.address || "Chưa có địa chỉ"}
          </InfoText>
          <InfoText>
            <strong>Thành phố:</strong>{" "}
            {listing.location?.city || "Chưa có thông tin"}
          </InfoText>
          <InfoText>
            <strong>Quận/Huyện:</strong>{" "}
            {listing.location?.district || "Chưa có thông tin"}
          </InfoText>
          <InfoText>
            <strong>Phường/Xã:</strong>{" "}
            {listing.location?.ward || "Chưa có thông tin"}
          </InfoText>
          <InfoText>
            <strong>Tọa độ:</strong>
            {`Lat: ${listing.location?.geoLocation.latitude}, Long: ${listing.location?.geoLocation.longitude}`}
          </InfoText>
        </Section>

        <Section>
          <h4>
            <IconWrapper>
              <FontAwesomeIcon icon={faHouseUser} />
            </IconWrapper>
            Thông tin phòng
          </h4>
          <InfoText>
            <strong>Loại phòng:</strong> {listing.roomType}
          </InfoText>
          <InfoText>
            <strong>Diện tích:</strong> {listing.size} m²
          </InfoText>
          <InfoText>
            <strong>Tình trạng:</strong>{" "}
            {listing.availability ? "Còn trống" : "Đã cho thuê"}
          </InfoText>
        </Section>

        <Section>
          <h4>
            <IconWrapper>
              <FontAwesomeIcon icon={faHouseUser} />
            </IconWrapper>
            Tiện ích
          </h4>
          <List>
            {listing.amenities?.hasWifi && (
              <ListItem>
                <FontAwesomeIcon icon={faWifi} /> Wifi
              </ListItem>
            )}
            {listing.amenities?.hasAirConditioner && (
              <ListItem>
                <FontAwesomeIcon icon={faTemperatureHigh} /> Điều hòa
              </ListItem>
            )}
            {listing.amenities?.hasHeater && (
              <ListItem>
                <FontAwesomeIcon icon={faShower} /> Máy nước nóng
              </ListItem>
            )}
            {listing.amenities?.hasKitchen && (
              <ListItem>
                <FontAwesomeIcon icon={faUtensils} /> Bếp
              </ListItem>
            )}
            {listing.amenities?.hasParking && (
              <ListItem>
                <FontAwesomeIcon icon={faCar} /> Bãi đỗ xe
              </ListItem>
            )}
            {listing.amenities?.hasElevator && (
              <ListItem>
                <FontAwesomeIcon icon={faElevator} /> Thang máy
              </ListItem>
            )}
          </List>
        </Section>

        <Section>
          <h4>
            <IconWrapper>
              <FontAwesomeIcon icon={faDollarSign} />
            </IconWrapper>
            Chi phí bổ sung
          </h4>
          <List>
            <ListItem>
              <FontAwesomeIcon icon={faBolt} /> Điện:{" "}
              {listing.additionalCosts?.electricity || 0} VND/kWh
            </ListItem>
            <ListItem>
              <FontAwesomeIcon icon={faTint} /> Nước:{" "}
              {listing.additionalCosts?.water || 0} VND/m³
            </ListItem>
            <ListItem>
              <FontAwesomeIcon icon={faWifi} /> Internet:{" "}
              {listing.additionalCosts?.internet || 0} VND/tháng
            </ListItem>
            <ListItem>
              <FontAwesomeIcon icon={faTrashAlt} /> Dọn dẹp:{" "}
              {listing.additionalCosts?.cleaning || 0} VND/tháng
            </ListItem>
          </List>
        </Section>

        <Section>
          <h4>
            <IconWrapper>
              <FontAwesomeIcon icon={faStar} />
            </IconWrapper>
            Đánh giá
          </h4>
          <InfoText>{listing.averageRating} sao</InfoText>
          <InfoText>
            <FontAwesomeIcon icon={faEye} /> {listing.views} lượt xem
          </InfoText>
        </Section>
      </DetailContainer>
      <ContactContainer>
        <ContactTitle>Liên hệ với Chủ trọ</ContactTitle>
        <ContactInfo>
          <Avatar src={avatar} alt={`${username}'s avatar`} />
          <ContactName>{username}</ContactName>
          <OnlineStatusWrapper>
            <OnlineStatus online={isOnline} />
            <StatusText>{isOnline ? "online" : "offline"}</StatusText>
          </OnlineStatusWrapper>
          <PhoneText>{phone ? phone : "Chưa có số điện thoại"}</PhoneText>
          <ContactText>{address ? address : "Chưa có địa chỉ"}</ContactText>
        </ContactInfo>

        <BookButton onClick={handleNavigate}>Đặt lịch</BookButton>
        {/* Thêm nút Đặt cọc */}
      </ContactContainer>
      {/* Hiển thị Form Đặt Lịch */}
      {showBookingForm && (
        <BookingFormContainer>
          <h4>Đặt lịch</h4>
          <form onSubmit={handleFormSubmit}>
            <FormLabel>
              Chủ đề:
              <FormInput
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                required
              />
            </FormLabel>
            <FormLabel>
              Ngày:
              <FormInput
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                required
              />
            </FormLabel>
            <FormLabel>
              Giờ:
              <FormInput
                type="time"
                name="time"
                value={formData.time}
                onChange={handleFormChange}
                required
              />
            </FormLabel>
            <FormButton type="submit">Xác nhận</FormButton>
            <CancelButton
              type="button"
              onClick={() => setShowBookingForm(false)}
            >
              Hủy
            </CancelButton>
          </form>
        </BookingFormContainer>
      )}
      <ChatBox landlord={landlord} />
    </MainContainer>
  );
};

export default ListingDetail;
