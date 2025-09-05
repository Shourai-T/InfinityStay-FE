import React, { useState } from "react";
import { UserPlus, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { authService } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const splitName = (fullName: string) => {
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length === 1) {
      return {
        firstName: nameParts[0],
        lastName: "",
      };
    }
    const lastName = nameParts[0]; // Lấy chữ đầu tiên làm họ
    const firstName = nameParts.slice(1).join(" "); // Phần còn lại làm tên
    return { firstName, lastName };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { name, phone, ...rest } = formData;
      const { firstName, lastName } = splitName(name);

      const registerData = {
        firstName,
        lastName,
        email: rest.email,
        phoneNumber: phone,
        password: rest.password,
        confirmPassword: rest.confirmPassword,
      };

      console.log("Submitting registration data:", registerData);

      const response = await authService.register(registerData);
      console.log("Registration response:", response);

      showToast.success("Đăng ký thành công! Vui lòng xác thực email của bạn");

      // Điều hướng với dữ liệu từ response
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          type: "register",
          userId: response.data?.data?.id || response.user?.id, // Kiểm tra cả 2 vị trí có thể chứa ID
        },
      });
    } catch (error: any) {
      const errorMessage = error.message || "Đăng ký thất bại";
      showToast.error(`Đăng ký thất bại: ${errorMessage}`);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-luxury flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 lg:pb-20">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center fade-in-up">
          {/* <button
            onClick={() => navigate("/")}
            className="flex items-center text-royal-400 hover:text-royal-300 mb-8 mx-auto transition-colors duration-300 font-body"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại trang chủ
          </button>

          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-royal rounded-2xl mb-6">
            <UserPlus className="h-10 w-10 text-white" />
          </div> */}

          <h2 className="text-4xl font-display font-bold text-gradient pb-2">
            Đăng ký
          </h2>
          <p className="text-lg text-lavender-300 font-body">
            Tạo tài khoản mới để bắt đầu đặt phòng
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
                  htmlFor="name"
                  className="block text-sm font-heading font-medium text-lavender-300 mb-3"
                >
                  Họ và tên *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`form-input w-full px-4 py-4 rounded-xl font-body ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Nhập họ và tên"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-heading font-medium text-lavender-300 mb-3"
                >
                  Email *
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
                  className={`form-input w-full px-4 py-4 rounded-xl font-body ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Nhập email của bạn"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-heading font-medium text-lavender-300 mb-3"
                >
                  Số điện thoại *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`form-input w-full px-4 py-4 rounded-xl font-body ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-heading font-medium text-lavender-300 mb-3"
                >
                  Mật khẩu *
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
                    className={`form-input w-full px-4 py-4 rounded-xl pr-12 font-body ${
                      errors.password ? "border-red-500" : ""
                    }`}
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
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-heading font-medium text-lavender-300 mb-3"
                >
                  Xác nhận mật khẩu *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`form-input w-full px-4 py-4 rounded-xl pr-12 font-body ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-lavender-400 hover:text-lavender-300 transition-colors duration-300"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 text-royal-500 border-lavender-600 rounded focus:ring-royal-500 bg-midnight-800"
                />
                <span className="ml-3 text-sm text-lavender-300 font-body">
                  Tôi đồng ý với{" "}
                  <button
                    type="button"
                    className="text-royal-400 hover:text-royal-300 transition-colors duration-300"
                  >
                    điều khoản sử dụng
                  </button>{" "}
                  và{" "}
                  <button
                    type="button"
                    className="text-royal-400 hover:text-royal-300 transition-colors duration-300"
                  >
                    chính sách bảo mật
                  </button>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 px-4 rounded-xl font-heading font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang tạo tài khoản...
                  </span>
                ) : (
                  "Đăng ký"
                )}
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lavender-300 font-body">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/dang-nhap")}
                className="text-royal-400 hover:text-royal-300 font-heading font-semibold transition-colors duration-300"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
