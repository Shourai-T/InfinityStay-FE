import React, { useState } from "react";
import { LogIn, ArrowLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import type { RootState, AppDispatch } from "../store";
import { showToast } from "../utils/toast";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Lấy URL redirect từ state (nếu có)
  const from = location.state?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(login(formData)).unwrap();

      if (result.data) {
        const user = result.data;
        showToast.success(
          `Chào mừng ${user.firstName || user.email}! Đăng nhập thành công`
        );

        // Điều hướng dựa trên role và URL trước đó
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          // Nếu người dùng từng muốn truy cập vào trang admin, không cho phép
          navigate(from.startsWith("/admin") ? "/" : from);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Đăng nhập thất bại";
      showToast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-luxury flex items-center justify-center pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center fade-in-up">
          <h2 className="text-4xl font-display font-bold text-gradient pb-2">
            Đăng nhập
          </h2>
          <p className="text-lg text-lavender-300 font-body">
            Chào mừng trở lại với Infinity Stay
          </p>
        </div>

        {/* Form */}
        <form
          className="mt-8 space-y-6 fade-in-up"
          onSubmit={handleSubmit}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="card-luxury rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-heading font-medium text-lavender-300 mb-3"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="form-input w-full px-4 py-4 rounded-xl font-body"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-heading font-medium text-lavender-300 mb-3"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="form-input w-full px-4 py-4 rounded-xl pr-12 font-body"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-lavender-400 hover:text-lavender-300 transition-colors duration-300"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-royal-500 border-lavender-600 rounded focus:ring-royal-500 bg-midnight-800"
                  />
                  <span className="ml-3 text-sm text-lavender-300 font-body">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-royal-400 hover:text-royal-300 transition-colors duration-300 font-body"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 px-4 rounded-xl font-heading font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lavender-300 font-body">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/dang-ky")}
                className="text-royal-400 hover:text-royal-300 font-heading font-semibold transition-colors duration-300"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
