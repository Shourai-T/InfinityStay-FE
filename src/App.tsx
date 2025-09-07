import { Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { AuthProvider } from "./contexts/AuthContext";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import PublicRoute from "./components/PublicRoute";
import ChatPopup from "./pages/ChatPopup";
import PaymentCf from "./pages/Payment/PaymentCf";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Booking = lazy(() => import("./pages/Booking/Booking"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const RoomDetail = lazy(() => import("./pages/RoomDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const PaymentFailed = lazy(() => import("./pages/Booking/PaymentFailed"));
// Admin Page
const AdminDashboard = lazy(() => import("./Admin/components/AdminDashboard"));

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Admin routes - Chỉ admin mới truy cập được */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminDashboard />
              </Suspense>
            </AdminRoute>
          }
        />

        {/* User routes - rendered inside Layout with header */}
        <Route
          element={
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Outlet />
              </Suspense>
            </Layout>
          }
        >
          {/* Trang không cần protected */}
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />

          {/* Trang chỉ dành cho user, admin không thể truy cập */}
          <Route
            path="/phong"
            element={
              <PublicRoute>
                <Rooms />
              </PublicRoute>
            }
          />
          <Route
            path="/phong/:slug"
            element={
              <UserRoute>
                <RoomDetail />
              </UserRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <VerifyOTP />
              </PublicRoute>
            }
          />
          <Route
            path="/dat-phong"
            element={
              <UserRoute>
                <Booking />
              </UserRoute>
            }
          />
          <Route
            path="/xac-nhan"
            element={
              <UserRoute>
                <Confirmation />
              </UserRoute>
            }
          />
          <Route
            path="/dat-phong-cua-toi"
            element={
              <UserRoute>
                <MyBookings />
              </UserRoute>
            }
          />

          <Route
            path="/ho-so"
            element={
              <UserRoute>
                <Profile />
              </UserRoute>
            }
          />
          <Route
            path="/thanh-toan-that-bai"
            element={
              <UserRoute>
                <PaymentFailed />
              </UserRoute>
            }
          />
          <Route
            path="/payment-confirm"
            element={
              <UserRoute>
                <PaymentCf />
              </UserRoute>
            }
          />
          {/* Trang chỉ dành cho người chưa đăng nhập */}
          <Route
            path="/dang-nhap"
            element={
              <PublicRoute restricted>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/dang-ky"
            element={
              <PublicRoute restricted>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute restricted>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ChatPopup />
    </AuthProvider>
  );
}

export default App;
