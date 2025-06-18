import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Button,
  LinearProgress,
} from "@mui/material";
import { CheckCircle, Warning, Info } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const CurrentPackagePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentPackage = async () => {
      try {
        const response = await axios.get(
          "https://be-android-project.onrender.com/api/packages/current",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error || "Không thể tải thông tin gói hiện tại"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPackage();
  }, []);

  const calculateProgress = () => {
    if (!data) return 0;
    const totalDays = dayjs(data.expiresAt).diff(
      dayjs(data.purchasedAt),
      "day"
    );
    const remainingDays = dayjs(data.expiresAt).diff(dayjs(), "day");
    return ((totalDays - remainingDays) / totalDays) * 100;
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", py: 4 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/packages")}>
          Xem các gói hiện có
        </Button>
      </Container>
    );
  }

  if (!data?.hasActivePackage) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Box sx={{ mb: 3 }}>
          <Warning color="warning" sx={{ fontSize: 60 }} />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Bạn chưa có gói bài đăng nào
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Đăng ký ngay để bắt đầu đăng bài và tiếp cận khách hàng tiềm năng
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/packages")}
        >
          Chọn gói ngay
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Gói bài đăng hiện tại
      </Typography>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                {data.package.name}
                {data.isActive ? (
                  <Chip
                    label="Đang hoạt động"
                    color="success"
                    size="small"
                    sx={{ ml: 1, fontWeight: "bold" }}
                  />
                ) : (
                  <Chip
                    label="Đã hết hạn"
                    color="error"
                    size="small"
                    sx={{ ml: 1, fontWeight: "bold" }}
                  />
                )}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {data.package.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                  Ngày kích hoạt: {dayjs(data.purchasedAt).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                  Ngày hết hạn: {dayjs(data.expiresAt).format("DD/MM/YYYY")}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Tiến trình sử dụng:</Typography>
                <LinearProgress
                  variant="determinate"
                  value={calculateProgress()}
                  color={calculateProgress() > 80 ? "warning" : "primary"}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Còn lại {dayjs(data.expiresAt).diff(dayjs(), "day")} ngày
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: "#f5f5f5", p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Thống kê sử dụng
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Số bài đã đăng:</Typography>
                  <Typography fontWeight="bold">
                    {data.package.postLimit - data.postsLeft}/
                    {data.package.postLimit}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography>Số bài còn lại:</Typography>
                  <Typography
                    fontWeight="bold"
                    color={data.postsLeft === 0 ? "error" : "primary"}
                  >
                    {data.postsLeft}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Tính năng bao gồm:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                  {data.package.features.map((feature, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <CheckCircle
                        color="success"
                        fontSize="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body1">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/package")}>
          Xem các gói khác
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create-post")}
        >
          Đăng bài ngay
        </Button>
      </Box>
    </Container>
  );
};

export default CurrentPackagePage;
