import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

/**
 * Component bảo vệ route, kiểm tra quyền truy cập dựa trên role
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = ["user", "admin"],
}) => {
  const { user, token, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Kiểm tra đã đăng nhập chưa
  if (!user || !token) {
    // Lưu đường dẫn hiện tại để chuyển hướng sau khi đăng nhập
    return (
      <Navigate to="/dang-nhap" state={{ from: location.pathname }} replace />
    );
  }

  // Kiểm tra quyền truy cập dựa trên role
  if (!requiredRole.includes(role)) {
    // Chuyển hướng dựa trên role hiện tại
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
