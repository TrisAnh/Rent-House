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
import Listings from "../pages/listingsRooom";
import ListingDetail from "../pages/ListingDetail";
import Profile from "../pages/Profile";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import HearderReponsive from "../components/common/Header_reponsive";
import OTP from "../pages/OTP";
import ForgotPassword from "../pages/ForgotPassword";
import EditProfile from "../pages/EditProfile";
import CreatePost from "../pages/CreatePost";
import PhoneVerification from "../pages/PhoneVerify";
import Contract from "../pages/Contract";
import FavoritesPage from "../pages/Favorites";
import { BookingFormContainer } from "../styled/ListingDetailStyles";
import RoomBookingForm from "../pages/BookingForm";
import PaymentPage from "../pages/PaymentPage";
import RenterHeader from "../components/common/renterHeader";
import BookingDetails from "../PageLandlord/InforBooking";
import ListingDetailLandlord from "../PageLandlord/ListingDetail";
import ListingEditForm from "../PageLandlord/EditForm";
import ThankYouPage from "../pages/ThankYou";
import ListingsApartment from "../pages/listingsApartment";
import SharedListings from "../pages/SharedListings";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import BookingDetailsUser from "../pages/InforBookingUser";
// Import the ChatMessenger component
import ChatMessenger from "../pages/ChatMessenger";

const AppRoutes = () => {
  const { user, user_role } = useAuth();
  console.log("approute", user_role);
  return (
    <Router>
      {/* Conditionally render the header based on userRole */}
      {user_role === "Renter" ? <RenterHeader /> : <Header />}

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
        <Route path="/apartment" element={<ListingsApartment />} />
        <Route path="/shared" element={<SharedListings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/listingLandlord" element={<ListingDetailLandlord />} />
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
        <Route path="/phone" element={<PhoneVerification />} />
        <Route path="/Contract" element={<Contract />} />
        <Route path="/favourite" element={<FavoritesPage />} />
        {/* Thêm các tuyến đường khác nếu cần */}
        <Route path="/booking/:id" element={<RoomBookingForm />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/listingeditform/:id" element={<ListingEditForm />} />
        <Route path="/thanks" element={<ThankYouPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/inforbooking" element={<BookingDetailsUser />} />
      </Routes>

      {user && <ChatMessenger />}

      <Footer />
    </Router>
  );
};

export default AppRoutes;
