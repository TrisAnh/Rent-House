import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Listings from "../pages/Listings";
import ListingDetail from "../pages/ListingDetail";
import Profile from "../pages/Profile";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import OTP from "../pages/OTP";
import ForgotPassword from "../pages/ForgotPassword";
import EditProfile from "../pages/EditProfile";
import CreatePost from "../pages/CreatePost";
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      {" "}
      {/* Router bao bọc toàn bộ ứng dụng */}
      <Header /> {/* Header được render đúng cách và không lặp */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/login" />}
        />
        <Route
          path="/otp"
          element={!user ? <OTP /> : <Navigate to="/register" />}
        />
        <Route
          path="/forgot-password"
          element={!user ? <ForgotPassword /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/editProfile"
          element={user ? <EditProfile /> : <Navigate to="/profile" />}
        />
        <Route
          path="/create-post"
          element={user ? <CreatePost /> : <Navigate to="/" />}
        />
        {/* Thêm các tuyến đường khác nếu cần */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRoutes;
