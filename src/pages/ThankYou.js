import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { IoHomeOutline, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "30px",
  fontSize: "1.1rem",
  textTransform: "none",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const PaymentDetailsBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  textAlign: "left",
  maxWidth: "500px",
  width: "100%",
}));

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const vnp_TxnRef = searchParams.get("vnp_TxnRef");
        
        if (!vnp_TxnRef) {
          setPaymentStatus("invalid");
          return;
        }

        // Gọi API xác minh thanh toán với orderId (vnp_TxnRef)
        const response = await axios.get(`http://localhost:5000/api/packages/verify-payment/${vnp_TxnRef}`);
        
        if (response.data.status === "completed") {
          setPaymentStatus("success");
          setPaymentData({
            amount: response.data.amount,
            package: response.data.package,
            transactionId: vnp_TxnRef,
            bankCode: searchParams.get("vnp_BankCode"),
            paymentDate: searchParams.get("vnp_PayDate"),
          });
        } else {
          setPaymentStatus("failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError("Failed to verify payment. Please check your purchase history.");
        setPaymentStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams]);

  const formatPaymentDate = (vnpPayDate) => {
    if (!vnpPayDate) return "N/A";
    const year = vnpPayDate.substring(0, 4);
    const month = vnpPayDate.substring(4, 6);
    const day = vnpPayDate.substring(6, 8);
    const hour = vnpPayDate.substring(8, 10);
    const minute = vnpPayDate.substring(10, 12);
    const second = vnpPayDate.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (paymentStatus === "processing") {
    return (
      <StyledContainer>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Verifying your payment...
        </Typography>
      </StyledContainer>
    );
  }

  if (paymentStatus === "invalid") {
    return (
      <StyledContainer>
        <Alert severity="error" sx={{ mb: 3 }}>
          Invalid payment confirmation page
        </Alert>
        <StyledButton
          variant="contained"
          color="primary"
          startIcon={<IoHomeOutline />}
          onClick={() => (window.location.href = "/")}
        >
          Return Home
        </StyledButton>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <StyledButton
          variant="contained"
          color="primary"
          startIcon={<IoHomeOutline />}
          onClick={() => (window.location.href = "/")}
        >
          Return Home
        </StyledButton>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer as="main" role="main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {paymentStatus === "success" ? (
          <>
            <Box sx={{ color: "success.main", fontSize: "4rem", mb: 2 }}>
              <IoCheckmarkCircle />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Thank you for your purchase. Your package has been activated.
            </Typography>

            <PaymentDetailsBox>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography>
                  <strong>Transaction ID:</strong> {paymentData?.transactionId || "N/A"}
                </Typography>
                <Typography>
                  <strong>Package:</strong> {paymentData?.package?.name || "N/A"}
                </Typography>
                <Typography>
                  <strong>Amount:</strong> {formatCurrency(paymentData?.amount)}
                </Typography>
                <Typography>
                  <strong>Payment Method:</strong>{" "}
                  {paymentData?.bankCode ? `VNPay (${paymentData.bankCode})` : "N/A"}
                </Typography>
                <Typography>
                  <strong>Date:</strong> {formatPaymentDate(paymentData?.paymentDate)}
                </Typography>
              </Box>
            </PaymentDetailsBox>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={() => (window.location.href = "/user/packages")}
              >
                View Your Package
              </StyledButton>
              <StyledButton
                variant="outlined"
                color="primary"
                startIcon={<IoHomeOutline />}
                onClick={() => (window.location.href = "/")}
              >
                Back to Home
              </StyledButton>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ color: "error.main", fontSize: "4rem", mb: 2 }}>
              <IoCloseCircle />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Payment Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We couldn't process your payment. Please try again or contact support.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={() => (window.location.href = "/packages")}
              >
                Try Again
              </StyledButton>
              <StyledButton
                variant="outlined"
                color="primary"
                startIcon={<IoHomeOutline />}
                onClick={() => (window.location.href = "/")}
              >
                Back to Home
              </StyledButton>
            </Box>
          </>
        )}
      </motion.div>
    </StyledContainer>
  );
};

export default ThankYouPage;