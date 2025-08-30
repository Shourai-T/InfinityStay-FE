import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../store";

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean; // Nếu true, người dùng đã đăng nhập sẽ được chuyển hướng
}

/**
 * Component cho các route công khai, có thể giới hạn truy cập cho người đã đăng nhập
 */
const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  restricted = false,
}) => {
  const { user, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Nếu đã đăng nhập và route bị giới hạn (như trang đăng nhập), chuyển hướng theo role
  if (user && restricted) {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
