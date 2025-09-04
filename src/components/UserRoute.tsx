import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../store";

interface UserRouteProps {
  children: React.ReactNode;
}

/**
 * Component bảo vệ route dành cho user, admin không được phép truy cập
 */
const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
  const { user, token, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Kiểm tra đã đăng nhập chưa
  if (!user || !token) {
    return (
      <Navigate to="/dang-nhap" state={{ from: location.pathname }} replace />
    );
  }

  // Nếu là admin, chuyển hướng về trang admin
  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default UserRoute;
