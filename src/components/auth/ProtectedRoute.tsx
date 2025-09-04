import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import LoadingSpinner from "../ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, token, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  // Nếu đang loading, hiển thị spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Kiểm tra xác thực
  const isAuthenticated = !!token && !!user;

  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền admin nếu cần
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Nếu đã xác thực và phân quyền thành công, hiển thị nội dung
  return <>{children}</>;
};

export default ProtectedRoute;
