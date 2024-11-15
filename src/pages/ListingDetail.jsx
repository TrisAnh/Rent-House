import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  MainContainer,
  DetailContainer,
  Section,
  SliderContainer,
  Image,
  Video,
  Title,
  InfoText,
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
  Avatar,
  OnlineStatus,
  PhoneText,
  OnlineStatusWrapper,
  StatusText,
} from "../styled/ListingDetailStyles";
import { getUserById } from "../api/users";
import ChatBox from "../pages/ChatBox";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comments from "../pages/Comment";
import styled from "styled-components";

// Tạo styled-component mới cho phần bình luận
const CommentSection = styled(Section)`
  margin-top: 2rem;
`;

const CommentTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  const toggleFavorite = async () => {
    try {
      setIsFavorited(!isFavorited);
      toast.success("Mục yêu thích đã được tạo thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm yêu thích:", err);
      toast.error("Lỗi khi thêm yêu thích!");
    }
  };

  const handleNavigate = () => {
    navigate(`/booking/${id}`);
  };

  const handleNavigate1 = () => {
    navigate(`/contract`, { state: { amount: listing.price, listingId: id } });
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  const { phone, address, username, avatar, isOnline } = landlord || {};

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
        <SliderContainer>
          <Slider {...settings}>
            {listing.images &&
              listing.images.map((image, index) => (
                <div key={index}>
                  <Image src={image} alt={`Image ${index + 1}`} />
                </div>
              ))}
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
            <strong>Tọa độ:</strong>{" "}
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
        <CommentSection>
          <Comments listingId={id} />
        </CommentSection>
      </DetailContainer>
      <ContactContainer>
        <ContactTitle>Liên hệ với Chủ trọ</ContactTitle>
        <ContactInfo>
          <Avatar src={avatar} alt={`${username}'s avatar`} />
          <ContactName>{username}</ContactName>

          <PhoneText>{phone ? phone : "Chưa có số điện thoại"}</PhoneText>
          <ContactText>{address ? address : "Chưa có địa chỉ"}</ContactText>
        </ContactInfo>
        {user ? (
          <>
            <BookButton onClick={handleNavigate}>Đặt lịch</BookButton>
            <BookButton onClick={handleNavigate1}>Đặt cọc</BookButton>
          </>
        ) : (
          <p>Vui lòng đăng nhập để đặt lịch hoặc đặt cọc.</p>
        )}
      </ContactContainer>
      <ChatBox landlord={landlord} />
    </MainContainer>
  );
};

export default ListingDetail;
