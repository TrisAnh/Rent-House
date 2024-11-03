import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createRequest } from "../api/request";
import { getPostById } from "../api/post";

const RoomBookingForm = () => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const { id } = useParams();
  const [landlord, setLandlord] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await getPostById(id);
        setPostDetails(response.data);
        setLandlord(response.data.landlord);
      } catch (err) {
        setError("Không thể tải thông tin bài đăng.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Vui lòng chọn ngày và giờ");
      return;
    }

    const requestData = {
      id_user_rent: user.id,
      id_renter: landlord,
      id_post: id,
      date_time: new Date(`${date.toISOString().split("T")[0]}T${time}`),
    };

    try {
      const response = await createRequest(requestData);
      alert("Đặt lịch thành công!");
      navigate(`/listings/${id}`); // Quay lại trang bài đăng
      console.log(response);
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Đặt lịch không thành công. Vui lòng thử lại.");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>{postDetails.title}</h2>
      <p style={subHeaderStyle}>Chọn ngày và giờ để đặt lịch</p>
      <div style={imageContainerStyle}>
        {postDetails.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Hình ảnh phòng ${index + 1}`}
            style={imageStyle}
          />
        ))}
      </div>
      <div style={priceStyle}>{postDetails.price.toLocaleString()} VND</div>
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Chọn ngày"
        customInput={<input style={inputStyle} />}
      />
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        style={inputStyle}
      >
        <option value="">Chọn giờ</option>
        <option value="09:00">09:00</option>
        <option value="10:00">10:00</option>
        <option value="11:00">11:00</option>
        <option value="14:00">14:00</option>
        <option value="15:00">15:00</option>
        <option value="16:00">16:00</option>
      </select>
      <button onClick={handleBooking} style={buttonStyle}>
        Đặt Lịch
      </button>
    </div>
  );
};

const containerStyle = {
  maxWidth: "400px",
  margin: "0 auto",
  padding: "20px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#fff",
  borderRadius: "8px",
};

const headerStyle = {
  fontSize: "24px",
  marginBottom: "10px",
};

const subHeaderStyle = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "20px",
};

const imageContainerStyle = {
  display: "flex",
  flexDirection: "column", // Sắp xếp hình ảnh theo cột
  marginBottom: "20px",
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "10px",
};

const priceStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "black",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
};

export default RoomBookingForm;
