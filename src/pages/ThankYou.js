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
import { IoHomeOutline, IoCheckmarkCircle, IoCloseCircle, IoWarning } from "react-icons/io5";
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
  backgroundColor: "#f5f5f5",
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
  const [packageData, setPackageData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // Lấy status và message từ URL parameters (được set từ backend callback)
        const status = searchParams.get("status");
        const message = searchParams.get("message");
        
        console.log("Payment result from URL:", { status, message });

        if (status === "success") {
          setPaymentStatus("success");
          
          // Lấy thông tin gói hiện tại của user sau khi thanh toán thành công
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              throw new Error("No authentication token found");
            }

            const response = await axios.get(
              "http://localhost:5000/api/packages/current",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.data && response.data.hasActivePackage) {
              setPackageData(response.data);
            }
          } catch (packageError) {
            console.error("Error fetching package info:", packageError);
            // Không set error vì payment đã thành công, chỉ không lấy được thông tin gói
          }

          // Lấy thông tin từ VNPay parameters nếu có
          const paymentInfo = {
            transactionId: searchParams.get("vnp_TxnRef"),
            bankCode: searchParams.get("vnp_BankCode"),
            paymentDate: searchParams.get("vnp_PayDate"),
            amount: searchParams.get("vnp_Amount"),
            orderInfo: searchParams.get("vnp_OrderInfo"),
          };

          setPaymentData(paymentInfo);
          
        } else if (status === "failed" || status === "error") {
          setPaymentStatus("failed");
          setError(message || "Payment failed");
        } else {
          // Nếu không có status parameter, có thể là truy cập trực tiếp
          setPaymentStatus("invalid");
        }
      } catch (err) {
        console.error("Error processing payment result:", err);
        setError("Unable to process payment result");
        setPaymentStatus("error");
      }
    };

    processPaymentResult();
  }, [searchParams]);

  const formatPaymentDate = (vnpPayDate) => {
    if (!vnpPayDate) return "N/A";
    // Format: YYYYMMDDHHmmss
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
    // VNPay amount is multiplied by 100
    const actualAmount = parseInt(amount) / 100;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(actualAmount);
  };

  const handleViewPackage = async () => {
    // Refresh package info before redirecting
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.get("http://localhost:5000/api/packages/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Error refreshing package info:", error);
    }
    window.location.href = "/user/packages";
  };

  if (paymentStatus === "processing") {
    return (
      <StyledContainer>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Processing payment result...
        </Typography>
      </StyledContainer>
    );
  }

  if (paymentStatus === "invalid") {
    return (
      <StyledContainer>
        <Box sx={{ color: "warning.main", fontSize: "4rem", mb: 2 }}>
          <IoWarning />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Invalid Access
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This page can only be accessed after a payment transaction.
        </Typography>
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

  if (error && paymentStatus === "error") {
    return (
      <StyledContainer>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
          {error}
        </Alert>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/package")}
          >
            Try Again
          </StyledButton>
          <StyledButton
            variant="outlined"
            color="primary"
            startIcon={<IoHomeOutline />}
            onClick={() => (window.location.href = "/")}
          >
            Return Home
          </StyledButton>
        </Box>
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
              Thanh toán thành công
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Cảm ơn vì đã đặt hàng. Gói của bạn đã được kích hoạt thành công.
            </Typography>

            {/* Package Information */}
            {packageData && packageData.hasActivePackage && (
              <Alert severity="success" sx={{ mb: 3, maxWidth: 500 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Gói được kích hoạt: {packageData.package?.name}
                </Typography>
                <Typography variant="body2">
                  Số lượng bài đăng còn lại: {packageData.postsLeft} | 
                  Hạn sử dụng: {new Date(packageData.expiresAt).toLocaleDateString('vi-VN')}
                </Typography>
              </Alert>
            )}

            {/* Payment Details */}
            {paymentData && (
              <PaymentDetailsBox>
                <Typography variant="h6" gutterBottom>
                  Chi tiết hóa đơn
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {paymentData.transactionId && (
                    <Typography>
                      <strong>Transaction ID:</strong> {paymentData.transactionId}
                    </Typography>
                  )}
                  {paymentData.orderInfo && (
                    <Typography>
                      <strong>Package:</strong> {decodeURIComponent(paymentData.orderInfo)}
                    </Typography>
                  )}
                  {paymentData.amount && (
                    <Typography>
                      <strong>Amount:</strong> {formatCurrency(paymentData.amount)}
                    </Typography>
                  )}
                  {paymentData.bankCode && (
                    <Typography>
                      <strong>Payment Method:</strong> VNPay ({paymentData.bankCode})
                    </Typography>
                  )}
                  {paymentData.paymentDate && (
                    <Typography>
                      <strong>Date:</strong> {formatPaymentDate(paymentData.paymentDate)}
                    </Typography>
                  )}
                </Box>
              </PaymentDetailsBox>
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleViewPackage}
              >
                Xem gói của bạn
              </StyledButton>
              <StyledButton
                variant="outlined"
                color="primary"
                startIcon={<IoHomeOutline />}
                onClick={() => (window.location.href = "/")}
              >
                Về trang chủ
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
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {error || "We couldn't process your payment. Please try again or contact support."}
            </Typography>

            <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
              <Typography variant="body2">
                If money was deducted from your account, it will be refunded within 1-3 business days.
                Please contact support if you need assistance.
              </Typography>
            </Alert>

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