import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../store";

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Component bảo vệ route admin, chỉ cho phép admin truy cập
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, token, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Kiểm tra đã đăng nhập chưa
  if (!user || !token) {
    return (
      <Navigate to="/dang-nhap" state={{ from: location.pathname }} replace />
    );
  }

  // Kiểm tra role có phải admin không
  if (role !== "admin") {
    // Nếu không phải admin, chuyển về trang chính
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
