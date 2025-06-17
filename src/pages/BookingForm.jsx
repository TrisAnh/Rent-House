import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createRequest } from "../api/request";
import { getPostById } from "../api/post";

const RoomBookingForm = ({ onClose }) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const { id } = useParams();
  const [landlord, setLandlord] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // THÊM HÀM VALIDATE DATE
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    return date < today;
  };

  // THÊM MIN DATE (từ hôm nay)
  const minDate = new Date();

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Vui lòng chọn ngày và giờ");
      return;
    }

    // THÊM VALIDATION CHO NGÀY QUÁ KHỨ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Không thể đặt lịch cho ngày trong quá khứ!");
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
      onClose();
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Đặt lịch không thành công. Vui lòng thử lại.");
    }
  };

  if (loading) return <p style={loadingStyle}>Đang tải...</p>;
  if (error) return <p style={errorStyle}>{error}</p>;

  return (
    <div style={containerStyle}>
      <button onClick={onClose} style={closeButtonStyle}>
        X
      </button>
      <h2 style={headerStyle}>{postDetails.title}</h2>
      <p style={subHeaderStyle}>Chọn ngày và giờ để đặt lịch</p>
      <div style={imageContainerStyle}>
        <img
          src={postDetails.images[0]?.url || "/placeholder.svg"}
          alt="Hình ảnh phòng"
          style={imageStyle}
        />
      </div>
      <div style={priceStyle}>{postDetails.price.toLocaleString()} VND</div>
      <form onSubmit={handleBooking} style={formStyle}>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Chọn ngày (từ hôm nay)"
          customInput={<input style={inputStyle} />}
          minDate={minDate} // KHÔNG CHO CHỌN NGÀY QUÁ KHỨ
          filterDate={(date) => !isDateDisabled(date)} // THÊM FILTER
        />
        
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={inputStyle}
        >
          <option value="">Chọn giờ</option>
          {/* SÁNG */}
          <option value="08:00">08:00 - Sáng</option>
          <option value="08:30">08:30 - Sáng</option>
          <option value="09:00">09:00 - Sáng</option>
          <option value="09:30">09:30 - Sáng</option>
          <option value="10:00">10:00 - Sáng</option>
          <option value="10:30">10:30 - Sáng</option>
          <option value="11:00">11:00 - Sáng</option>
          <option value="11:30">11:30 - Sáng</option>
          
          {/* CHIỀU */}
          <option value="13:00">13:00 - Chiều</option>
          <option value="13:30">13:30 - Chiều</option>
          <option value="14:00">14:00 - Chiều</option>
          <option value="14:30">14:30 - Chiều</option>
          <option value="15:00">15:00 - Chiều</option>
          <option value="15:30">15:30 - Chiều</option>
          <option value="16:00">16:00 - Chiều</option>
          <option value="16:30">16:30 - Chiều</option>
          <option value="17:00">17:00 - Chiều</option>
          <option value="17:30">17:30 - Chiều</option>
          
          {/* TỐI */}
          <option value="18:00">18:00 - Tối</option>
          <option value="18:30">18:30 - Tối</option>
          <option value="19:00">19:00 - Tối</option>
          <option value="19:30">19:30 - Tối</option>
          <option value="20:00">20:00 - Tối</option>
        </select>
        
        <button type="submit" style={buttonStyle}>
          Đặt Lịch
        </button>
      </form>
    </div>
  );
};

// ... existing styles ...

const containerStyle = {
  maxWidth: "400px",
  margin: "0 auto",
  padding: "20px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#fff",
  borderRadius: "8px",
  position: "relative",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
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
  marginBottom: "20px",
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "8px",
};

const priceStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
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

const loadingStyle = {
  textAlign: "center",
  padding: "20px",
};

const errorStyle = {
  textAlign: "center",
  color: "red",
  padding: "20px",
};

export default RoomBookingForm;
