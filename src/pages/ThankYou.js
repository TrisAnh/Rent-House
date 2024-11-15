import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { IoHomeOutline } from "react-icons/io5";

const StyledContainer = styled(Container)(() => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-4.0.3")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "32px",
  textAlign: "center",
  gap: "32px",
}));

const StyledButton = styled(Button)(() => ({
  padding: "12px 32px",
  borderRadius: "30px",
  fontSize: "1.1rem",
  textTransform: "none",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
  },
  "&:focus": {
    outline: "3px solid",
    outlineColor: "#90caf9",
    outlineOffset: "2px",
  },
}));

const ThankYouPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Simulating API call or content loading
        setIsLoading(false);
      } catch (err) {
        setError(
          "We encountered an issue loading the confirmation page. Please refresh or contact support."
        );
        setIsLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <StyledContainer>
        <CircularProgress size={60} thickness={4} />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Typography
          variant="h4"
          component="h1"
          color="error"
          gutterBottom
          role="alert"
        >
          {error}
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

  return (
    <StyledContainer as="main" role="main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 3,
          }}
        >
          Thank You!
        </Typography>

        <Typography
          variant="h5"
          component="p"
          sx={{
            color: "text.secondary",
            maxWidth: "600px",
            mb: 4,
          }}
        >
          Your payment has been successfully processed. We appreciate your trust
          in our services.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<IoHomeOutline />}
            onClick={() => (window.location.href = "/")}
            aria-label="Return to homepage"
          >
            Back to Homepage
          </StyledButton>
        </Box>
      </motion.div>
    </StyledContainer>
  );
};

export default ThankYouPage;
