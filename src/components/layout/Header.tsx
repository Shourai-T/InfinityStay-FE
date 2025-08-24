import React, { useState } from "react";
import {
  Hotel,
  User,
  Calendar,
  LogIn,
  UserPlus,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
// Thay thế useAuth bằng useSelector từ redux
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { RootState } from "../../store";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Lấy user từ redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-royal-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation("/")}
          >
            <div>
              <h1 className="text-xl font-display font-bold text-gradient">
                Infinity Stay
              </h1>
              <p className="text-xs text-lavender-400 font-body">
                Where comfort meets infinity
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation("/")}
              className={`px-4 py-2 text-sm font-heading font-medium transition-all duration-300 ${
                isActivePath("/")
                  ? "text-royal-400 border-b-2 border-royal-500"
                  : "text-lavender-300 hover:text-royal-400"
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => handleNavigation("/phong")}
              className={`px-4 py-2 text-sm font-heading font-medium transition-all duration-300 ${
                isActivePath("/phong")
                  ? "text-royal-400 border-b-2 border-royal-500"
                  : "text-lavender-300 hover:text-royal-400"
              }`}
            >
              Phòng & Giá
            </button>
            <button
              onClick={() => handleNavigation("/about-us")}
              className={`px-4 py-2 text-sm font-heading font-medium transition-all duration-300 ${
                isActivePath("/about-us")
                  ? "text-royal-400 border-b-2 border-royal-500"
                  : "text-lavender-300 hover:text-royal-400"
              }`}
            >
              Về chúng tôi
            </button>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleNavigation("/dat-phong-cua-toi")}
                  className="flex items-center space-x-2 text-lavender-300 hover:text-royal-400 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-royal-500/5"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline font-body">
                    Đặt phòng của tôi
                  </span>
                </button>
                <button
                  onClick={() => handleNavigation("/ho-so")}
                  className="flex items-center space-x-3 px-4 py-2 glass-effect rounded-xl hover:bg-royal-500/10 transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-royal rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-heading font-medium text-soft-white">
                    {/* Hiển thị tên user */}
                    {user.email}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm text-lavender-400 hover:text-lavender-300 transition-colors duration-300 font-body"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleNavigation("/dang-nhap")}
                  className="flex items-center space-x-2 text-lavender-300 hover:text-royal-400 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-royal-500/5"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="font-body">Đăng nhập</span>
                </button>
                <button
                  onClick={() => handleNavigation("/dang-ky")}
                  className="flex items-center space-x-2 btn-primary px-4 py-2 rounded-xl font-body"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Đăng ký</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-lavender-300 hover:text-royal-400 hover:bg-royal-500/5 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-royal-500/20 py-4">
            <div className="flex flex-col space-y-4">
              {/* Navigation Links */}
              <button
                onClick={() => handleNavigation("/")}
                className={`text-left px-4 py-3 text-sm font-heading font-medium transition-all duration-300 rounded-lg ${
                  isActivePath("/")
                    ? "text-royal-400 bg-royal-500/10 border-l-4 border-royal-500"
                    : "text-lavender-300 hover:text-royal-400 hover:bg-royal-500/5"
                }`}
              >
                Trang chủ
              </button>

              <button
                onClick={() => handleNavigation("/phong")}
                className={`text-left px-4 py-3 text-sm font-heading font-medium transition-all duration-300 rounded-lg ${
                  isActivePath("/phong")
                    ? "text-royal-400 bg-royal-500/10 border-l-4 border-royal-500"
                    : "text-lavender-300 hover:text-royal-400 hover:bg-royal-500/5"
                }`}
              >
                Phòng & Giá
              </button>

              <button
                onClick={() => handleNavigation("/about-us")}
                className={`text-left px-4 py-3 text-sm font-heading font-medium transition-all duration-300 rounded-lg ${
                  isActivePath("/about-us")
                    ? "text-royal-400 bg-royal-500/10 border-l-4 border-royal-500"
                    : "text-lavender-300 hover:text-royal-400 hover:bg-royal-500/5"
                }`}
              >
                Về chúng tôi
              </button>

              {/* User Section */}
              {user ? (
                <div className="border-t border-royal-500/20 pt-4 space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-4 py-2 glass-effect rounded-xl">
                    <div className="w-8 h-8 bg-gradient-royal rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-heading font-medium text-soft-white">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>

                  {/* My Bookings */}
                  <button
                    onClick={() => handleNavigation("/dat-phong-cua-toi")}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-lavender-300 hover:text-royal-400 transition-colors duration-300 rounded-lg hover:bg-royal-500/5"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="font-body">Đặt phòng của tôi</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 transition-colors duration-300 rounded-lg hover:bg-red-500/5 font-body"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="border-t border-royal-500/20 pt-4 space-y-4">
                  {/* Login */}
                  <button
                    onClick={() => handleNavigation("/dang-nhap")}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-lavender-300 hover:text-royal-400 transition-colors duration-300 rounded-lg hover:bg-royal-500/5"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="font-body">Đăng nhập</span>
                  </button>

                  {/* Register */}
                  <button
                    onClick={() => handleNavigation("/dang-ky")}
                    className="flex items-center space-x-3 w-full btn-primary px-4 py-3 rounded-xl font-body"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Đăng ký</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
