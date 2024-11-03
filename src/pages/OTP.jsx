import React from "react";
import useForm from "../hooks/useForm";
import { verifyOtp as verifyOtpApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Box,
  LeftSide,
  RightSide,
  Form,
  InputWrapper,
  Input,
  Button,
  Terms,
  ResendLink,
} from "../styled/OTPStyled";

const OTP = () => {
  const { values, handleChange } = useForm({
    email: "", // Thêm trường email
    otp: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyOtpApi(values.email, values.otp); // Gọi API với email và OTP
      if (response.status === 200) {
        toast.success("Xác thực OTP thành công!");
        navigate("/login");
      } else if (response.status === 400) {
        toast.error("Xác thực thất bại: Mã OTP không hợp lệ.");
      } else {
        toast.error("Xác thực thất bại: Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error(
        "Xác thực thất bại: " + error.response?.data?.msg || error.message
      ); // Hiển thị thông báo lỗi
    }
  };

  const handleResend = async () => {
    try {
      // Gọi API để gửi lại mã OTP
      // Ví dụ: await resendOtpApi();
      toast.success("Mã OTP đã được gửi lại!");
    } catch (error) {
      toast.error("Gửi lại OTP thất bại.");
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Box>
        <LeftSide>
          <h1>Xác Thực Tài Khoản</h1>
          <p>
            Vui lòng nhập mã OTP được gửi đến điện thoại hoặc email của bạn.
          </p>
        </LeftSide>
        <RightSide>
          <Form onSubmit={handleSubmit}>
            <h2>Nhập Mã OTP</h2>
            <InputWrapper>
              <Input
                type="email" // Đặt type là email
                name="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                type="text"
                name="otp"
                placeholder="Mã OTP"
                value={values.otp}
                onChange={handleChange}
                required
                maxLength="6"
              />
            </InputWrapper>
            <Button type="submit">Xác Thực</Button>
            <Terms>
              Nếu bạn không nhận được mã OTP, hãy{" "}
              <ResendLink onClick={handleResend}>
                nhấn vào đây để gửi lại
              </ResendLink>
              .
            </Terms>
          </Form>
        </RightSide>
      </Box>
    </Container>
  );
};

export default OTP;
