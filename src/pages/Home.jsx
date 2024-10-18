import React, { useEffect, useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { postTopView } from "../api/post";
import { searchPost } from "../api/post";
import {
  HomeContainer,
  Banner,
  BannerContent,
  BannerTitle,
  BannerSubtitle,
  SearchInput,
  SearchButton,
  SearchForm,
  SearchSelect,
  FeaturedSection,
  SectionTitle,
  PropertiesGrid,
  PropertyCard,
  PropertyImage,
  PropertyInfo,
  PropertyTitle,
  PropertyLocation,
  PropertyPrice,
  PropertyRating,
  PropertyDetails,
  PropertyAmenities,
  Amenity,
  TestimonialsSection,
  ContactSection,
  ContactInfo,
  ContactItem,
} from "./HomeStyled";
const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingTopViews, setLoadingTopViews] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    title: "",
    location: "",
    roomType: "",
    priceMin: "",
    priceMax: "",
  });
  useEffect(() => {
    const fetchTopViews = async () => {
      setLoadingTopViews(true); // Bắt đầu loading
      try {
        const response = await postTopView();
        setFeaturedProperties(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTopViews(false); // Kết thúc loading
      }
    };

    fetchTopViews();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoadingSearch(true); // Bắt đầu loading cho tìm kiếm
    try {
      const response = await searchPost(searchParams);
      console.log("Kết quả tìm kiếm:", response.data);
      setSearchResults(response.data); // Cập nhật danh sách kết quả tìm kiếm
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    } finally {
      setLoadingSearch(false); // Kết thúc loading cho tìm kiếm
    }
  };
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  if (loadingTopViews) {
    return <div>Đang tải danh sách nổi bật...</div>;
  }

  if (loadingSearch) {
    return <div>Đang tìm kiếm...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }
  return (
    <HomeContainer>
      <Banner>
        <BannerContent>
          <BannerTitle>Chào mừng đến với Rent-House.com</BannerTitle>
          <BannerSubtitle>
            Kênh thông tin phòng trọ số 1 Việt Nam
          </BannerSubtitle>
        </BannerContent>
      </Banner>

      {/* Thanh tìm kiếm */}
      <SearchForm onSubmit={handleSearchSubmit}>
        <SearchInput
          type="text"
          placeholder="Tìm kiếm nhà trọ..."
          name="title"
          value={searchParams.title}
          onChange={handleSearchChange}
        />
        <SearchInput
          type="text"
          placeholder="Vị trí..."
          name="location"
          value={searchParams.location}
          onChange={handleSearchChange}
        />
        <SearchSelect
          name="roomType"
          value={searchParams.roomType}
          onChange={handleSearchChange}
        >
          <option value="">Chọn loại phòng</option>
          <option value="single">Phòng đơn</option>
          <option value="double">Phòng đôi</option>
          <option value="suite">Suite</option>
        </SearchSelect>
        <SearchInput
          type="number"
          placeholder="Giá tối thiểu"
          name="priceMin"
          value={searchParams.priceMin}
          onChange={handleSearchChange}
        />
        <SearchInput
          type="number"
          placeholder="Giá tối đa"
          name="priceMax"
          value={searchParams.priceMax}
          onChange={handleSearchChange}
        />
        <SearchButton type="submit">
          <FaSearch />
        </SearchButton>
      </SearchForm>

      <FeaturedSection>
        <SectionTitle>Nhà trọ nổi bật</SectionTitle>
        <PropertiesGrid>
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id}>
              <PropertyImage src={property.images[0]} alt={property.title} />
              <PropertyInfo>
                <PropertyTitle>{property.title}</PropertyTitle>
                <PropertyLocation>
                  <FaMapMarkerAlt /> {property.location.address},{" "}
                  {property.location.city}, {property.location.district},{" "}
                  {property.location.ward}
                </PropertyLocation>
                <PropertyPrice>{property.price}</PropertyPrice>
                <PropertyRating>{property.averageRating} ⭐</PropertyRating>
                <PropertyDetails>
                  <PropertyAmenities>
                    {property.amenities.wifi && <Amenity>Wifi</Amenity>}
                    {property.amenities.airConditioner && (
                      <Amenity>Điều hòa</Amenity>
                    )}
                    {property.amenities.kitchen && <Amenity>Bếp</Amenity>}
                    {property.amenities.parking && (
                      <Amenity>Chỗ đậu xe</Amenity>
                    )}
                  </PropertyAmenities>
                </PropertyDetails>
              </PropertyInfo>
            </PropertyCard>
          ))}
        </PropertiesGrid>
      </FeaturedSection>
      {/* Phần đánh giá */}
      <TestimonialsSection>
        <SectionTitle>Khách hàng nói gì?</SectionTitle>
        {/* ... Đánh giá ở đây ... */}
      </TestimonialsSection>

      {/* Thông tin liên hệ */}
      <ContactSection>
        <SectionTitle>Liên hệ với chúng tôi</SectionTitle>
        <ContactInfo>
          <ContactItem>
            <FaPhoneAlt /> <span>Hotline: 0123 456 789</span>
          </ContactItem>
          {/* Thêm thông tin liên hệ khác... */}
        </ContactInfo>
      </ContactSection>
    </HomeContainer>
  );
};

export default Home;
