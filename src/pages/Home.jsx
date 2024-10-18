import React from "react";
import styled from "styled-components";
import BannerImage from "../assets/images/home-banner.jpg";
import Property1 from "../assets/images/property1.jpg";
import Property2 from "../assets/images/property2.jpg";
import { FaSearch, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

// Container chính
const HomeContainer = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
`;

// Banner
const Banner = styled.div`
  width: 100%;
  height: 50vh; /* Giữ nguyên chiều cao của banner */
  background-image: url(${BannerImage});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Lớp phủ mờ */
  }
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 1;
`;

const BannerTitle = styled.h1`
  font-size: 3rem;
  margin: 0;
  padding-bottom: 10px;
`;

const BannerSubtitle = styled.p`
  font-size: 1.5rem;
  margin: 0;
  padding-bottom: 20px;
`;

// Thanh tìm kiếm
const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  margin: -30px 0 40px 0; /* Điều chỉnh margin */
  position: relative;
  z-index: 2;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  border: none;
  border-radius: 4px 0 0 4px;
  outline: none;

  @media (max-width: 480px) {
    width: 200px;
  }
`;

const SearchButton = styled.button`
  padding: 10px;
  background-color: #ff5a5f;
  border: none;
  border-radius: 0 4px 4px 0;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e14e50;
  }
`;

// Các styled-components khác...
const FeaturedSection = styled.section`
  padding: 40px 20px;
  background-color: #f9f9f9;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PropertyCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
`;

const PropertyInfo = styled.div`
  padding: 15px;
  text-align: left;
  flex: 1;
`;

const PropertyTitle = styled.h3`
  margin: 0 0 10px 0;
`;

const PropertyLocation = styled.p`
  color: #777;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
`;

const PropertyPrice = styled.p`
  font-weight: bold;
  color: #ff5a5f;
`;

// Phần đánh giá
const TestimonialsSection = styled.section`
  padding: 40px 20px;
`;

const Testimonial = styled.div`
  max-width: 600px;
  margin: 0 auto 20px auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TestimonialText = styled.p`
  font-style: italic;
`;

const TestimonialAuthor = styled.p`
  text-align: right;
  font-weight: bold;
  margin-top: 10px;
`;

// Thông tin liên hệ
const ContactSection = styled.section`
  padding: 40px 20px;
  background-color: #f1f1f1;
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Home = () => {
  // Dữ liệu mẫu cho nhà trọ và đánh giá
  const featuredProperties = [
    {
      id: 1,
      image: Property1,
      title: "Phòng trọ gần trung tâm",
      location: "Quận 1, TP. HCM",
      price: "3.000.000 VND/tháng",
    },
    {
      id: 2,
      image: Property2,
      title: "Nhà trọ yên tĩnh",
      location: "Quận 7, TP. HCM",
      price: "2.500.000 VND/tháng",
    },
    // Thêm các mục khác...
  ];

  const testimonials = [
    {
      id: 1,
      text: "Rent-House.com đã giúp tôi tìm được một phòng trọ tuyệt vời gần nơi làm việc. Rất hài lòng!",
      author: "Nguyễn Văn A",
    },
    {
      id: 2,
      text: "Dịch vụ khách hàng tuyệt vời và nhiều lựa chọn nhà trọ phù hợp với nhu cầu.",
      author: "Trần Thị B",
    },
    // Thêm các đánh giá khác...
  ];

  const handleSearch = () => {
    // Xử lý tìm kiếm
    alert("Tính năng tìm kiếm chưa được triển khai.");
  };

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
      <SearchBar>
        <SearchInput type="text" placeholder="Tìm kiếm nhà trọ..." />
        <SearchButton onClick={handleSearch}>
          <FaSearch />
        </SearchButton>
      </SearchBar>

      {/* Danh sách nhà trọ nổi bật */}
      <FeaturedSection>
        <SectionTitle>Nhà trọ nổi bật</SectionTitle>
        <PropertiesGrid>
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id}>
              <PropertyImage src={property.image} alt={property.title} />
              <PropertyInfo>
                <PropertyTitle>{property.title}</PropertyTitle>
                <PropertyLocation>
                  <FaMapMarkerAlt /> {property.location}
                </PropertyLocation>
                <PropertyPrice>{property.price}</PropertyPrice>
              </PropertyInfo>
            </PropertyCard>
          ))}
        </PropertiesGrid>
      </FeaturedSection>

      {/* Phần đánh giá */}
      <TestimonialsSection>
        <SectionTitle>Khách hàng nói gì?</SectionTitle>
        {testimonials.map((testimonial) => (
          <Testimonial key={testimonial.id}>
            <TestimonialText>"{testimonial.text}"</TestimonialText>
            <TestimonialAuthor>- {testimonial.author}</TestimonialAuthor>
          </Testimonial>
        ))}
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
