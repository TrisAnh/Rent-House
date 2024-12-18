// src/pages/Register.jsx
import React from "react";
import useForm from "../hooks/useForm";
import { register as registerApi } from "../api/auth";
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
  LoginLink,
} from "../styled/RegisterStyled";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome } from "react-icons/fa";

const Register = () => {
  const { values, handleChange } = useForm({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerApi(values);
      console.log("123", response);
      // Kiểm tra mã trạng thái phản hồi
      if (response.status === 200) {
        toast.success("Đăng ký thành công! Vui lòng nhập mã OTP.");
        navigate("/otp"); // Điều hướng đến trang OTP
      } else if (response.status === 400) {
        toast.error("Đăng ký thất bại: Dữ liệu không hợp lệ.");
      } else {
        toast.error("Đăng ký thất bại: Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error(
        "Đăng ký thất bại: Vui lòng kiểm tra thông tin đã nhập và email"
      );
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Box>
        <LeftSide>
          <h1>Đăng Ký Cho Thuê Nhà Trọ</h1>
          <p>Cung cấp nhà trọ chất lượng và giá cả hợp lý</p>
        </LeftSide>
        <RightSide>
          <Form onSubmit={handleSubmit}>
            <h2>Đăng Ký</h2>
            <InputWrapper>
              <FaUser />
              <Input
                type="text"
                name="username"
                placeholder="Tên người dùng"
                value={values.username}
                onChange={handleChange}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <FaEnvelope />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <FaLock />
              <Input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={values.password}
                onChange={handleChange}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <FaPhone />
              <Input
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                value={values.phone}
                onChange={handleChange}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <FaHome />
              <Input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={values.address}
                onChange={handleChange}
                required
              />
            </InputWrapper>
            <Button type="submit">Đăng Ký</Button>
            <Terms>
              Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách
              bảo mật.
            </Terms>
            <LoginLink>
              Đã có tài khoản? <a href="/login">Đăng nhập</a>
            </LoginLink>
          </Form>
        </RightSide>
      </Box>
    </Container>
  );
};

export default Register;
