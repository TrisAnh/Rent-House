import React, { useState, useEffect } from "react";
import { getUserById } from "../api/users";
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  Fade,
  styled,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import axios from "axios";
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "2rem",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    opacity: 0.1,
    zIndex: -1,
  },
}));

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

const StyledButton = styled(Button)({
  padding: "1rem 2rem",
  fontSize: "1.1rem",
  fontWeight: 600,
  borderRadius: "8px",
  textTransform: "none",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
});

function formatCurrency(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const PaymentPage = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    depositAmount: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState(null);
  const location = useLocation();
  const { amount, listingId } = location.state || {
    amount: 2000,
    listingId: null,
  };

  const fetchProfile = async () => {
    if (!user || !user.id || !token) {
      return;
    }

    try {
      const response = await getUserById(user.id, token);
      setProfile(response.data);
      setProfile(response.data);
      setFormData({
        name: response.data.username,
        email: response.data.email,
        address: response.data.address,
        phone: response.data.phone,
        depositAmount: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, token]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }
    if (!formData.address) newErrors.address = "Address is required";

    return newErrors;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    try {
      const response = await axios.post(
        "https://be-android-project.onrender.com/api/order/create_payment_url",
        {
          amount: amount / 2,
          orderType: "",
          language: "",
          bankCode: "",
        }
      );

      if (response.status === 200 && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
        >
          Room Deposit Booking
        </Typography>

        {submitted ? (
          <Fade in={submitted}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Booking submitted successfully!
            </Alert>
          </Fade>
        ) : (
          <form onSubmit={handlePayment} noValidate>
            <StyledBox>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                fullWidth
                required
                inputProps={{ "aria-label": "Full Name" }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                fullWidth
                required
                inputProps={{ "aria-label": "Email Address" }}
              />

              <TextField
                label="Adress"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={Boolean(errors.address)}
                helperText={errors.address}
                fullWidth
                required
                inputProps={{ "aria-label": "Phone Number" }}
              />

              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                fullWidth
                required
                inputProps={{ "aria-label": "Phone Number" }}
              />

              <TextField
                label="Deposit Amount"
                name="depositAmount"
                value={formatCurrency(amount / 2)}
                onChange={handleChange}
                error={Boolean(errors.depositAmount)}
                helperText={errors.depositAmount}
                fullWidth
                required
                InputProps={{ readOnly: true, endAdornment: "VND" }}
                inputProps={{ "aria-label": "Deposit Amount", min: "0" }}
              />

              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Book Now
              </StyledButton>
            </StyledBox>
          </form>
        )}
      </StyledPaper>
    </Container>
  );
};

export default PaymentPage;
