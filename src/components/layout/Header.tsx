import React from "react";
import { Hotel, User, Calendar, LogIn, UserPlus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    // dispatch({ type: "SET_USER", payload: null });
    navigate("/");
  };

  return (
    <header className="glass-effect fixed left-0 right-0 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation("/")}
          >
            <div>
              <h1 className="text-2xl font-display font-bold text-gradient">
                Infinity Stay
              </h1>
              <p className="text-xs text-lavender-400 font-body">
                Where comfort meets infinity
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation("/")}
              className={`px-4 py-2 text-sm font-heading font-medium transition-all duration-300 ${
                location.pathname === "/"
                  ? "text-royal-400 border-b-2 border-royal-500"
                  : "text-lavender-300 hover:text-royal-400"
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => handleNavigation("/phong")}
              className={`px-4 py-2 text-sm font-heading font-medium transition-all duration-300 ${
                location.pathname === "/phong"
                  ? "text-royal-400 border-b-2 border-royal-500"
                  : "text-lavender-300 hover:text-royal-400"
              }`}
            >
              Phòng & Giá
            </button>
            <button
              onClick={() => handleNavigation("/about-us")}
              className={`px-4 py-2 text-sm font-heading font-medium transition-all duration-300 ${
                location.pathname === "/about-us"
                  ? "text-royal-400 border-b-2 border-royal-500"
                  : "text-lavender-300 hover:text-royal-400"
              }`}
            >
              Về chúng tôi
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {state.user ? (
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
                <div className="flex items-center space-x-3 px-4 py-2 glass-effect rounded-xl">
                  <div className="w-8 h-8 bg-gradient-royal rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-heading font-medium text-soft-white">
                    {state.user.name}
                  </span>
                </div>
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
                  className="flex items-center space-x-2 text-lavender-300 hover:text-royal-400 transition-colors duration-300 px-4 py-2"
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
        </div>
      </div>
    </header>
  );
};
