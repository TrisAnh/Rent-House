import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";
// Thêm file CSS của slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Styled Components bị thiếu
const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fdfdfd;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const Image = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const Video = styled.video`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #1a202c;
  font-weight: bold;
  text-align: center;
`;

const InfoText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 0.5rem 0;
  color: #4a4a4a;
`;

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ isFavorited }) => (isFavorited ? "red" : "#333")};
  transition: color 0.3s;
  &:hover {
    color: red;
  }
`;

const PriceText = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 1rem 0;
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
  color: #007bff;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  font-size: 1rem;
`;

const ListItem = styled.li`
  margin: 0.5rem 0;
`;

const ListingDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [listing, setListing] = useState(null); // Trạng thái chứa dữ liệu bài đăng
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [isFavorited, setIsFavorited] = useState(false); // Trạng thái yêu thích

  useEffect(() => {
    // Hàm fetch dữ liệu từ API
    const fetchListing = async () => {
      try {
        const response = await getPostById(id); // Lấy bài đăng theo ID
        setListing(response.data); // Lưu dữ liệu bài đăng
      } catch (err) {
        setError(err.message); // Gán lỗi nếu có
      } finally {
        setLoading(false); // Dừng trạng thái tải
      }
    };

    if (id) {
      fetchListing(); // Gọi hàm khi có ID
    }
  }, [id]); // Thực thi lại khi ID thay đổi

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited); // Thay đổi trạng thái yêu thích
    // Thêm logic lưu trạng thái yêu thích vào localStorage hoặc gọi API
  };

  if (loading) return <p>Đang tải...</p>; // Hiển thị khi đang tải
  if (error) return <p>{error}</p>; // Hiển thị khi có lỗi

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
    <DetailContainer>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{listing.title}</h2>
        <FavoriteButton isFavorited={isFavorited} onClick={toggleFavorite}>
          <FontAwesomeIcon icon={isFavorited ? faHeartSolid : faHeartRegular} />
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
          Giá: {listing.price ? listing.price.toLocaleString() : "Chưa có giá"}{" "}
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
  );
};

export default ListingDetail;
