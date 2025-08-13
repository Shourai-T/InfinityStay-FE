import React, { useState, useEffect } from "react";
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { showToast } from "../utils/toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const email = location.state?.email;
  const otpVerified = location.state?.otpVerified;

  useEffect(() => {
    if (!email || !otpVerified) {
      navigate("/forgot-password");
      return;
    }
  }, [email, otpVerified, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      showToast.success("Đặt lại mật khẩu thành công!");
      navigate("/dang-nhap");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-luxury flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center fade-in-up">
          <h2 className="text-4xl font-display font-bold text-gradient mb-2">
            Đặt lại mật khẩu
          </h2>
          <p className="text-lg text-lavender-300 font-body mb-2">
            Tạo mật khẩu mới cho tài khoản
          </p>
          <p className="text-royal-400 font-heading font-semibold">{email}</p>
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
                  htmlFor="newPassword"
                  className="block text-sm font-heading font-medium text-lavender-300 mb-3"
                >
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    className={`form-input w-full px-4 py-4 rounded-xl pr-12 font-body ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-lavender-400 hover:text-lavender-300 transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-heading font-medium text-lavender-300 mb-3"
                >
                  Xác nhận mật khẩu mới *
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
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4 text-lavender-400 hover:text-lavender-300 transition-colors duration-300"
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

              {/* Password Requirements */}
              <div className="bg-royal-500/10 border border-royal-500/30 rounded-xl p-4">
                <h4 className="text-sm font-heading font-semibold text-royal-300 mb-2">
                  Yêu cầu mật khẩu:
                </h4>
                <ul className="text-xs text-lavender-400 space-y-1 font-body">
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        formData.newPassword.length >= 6
                          ? "bg-green-400"
                          : "bg-lavender-600"
                      }`}
                    ></div>
                    Ít nhất 6 ký tự
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        formData.newPassword === formData.confirmPassword &&
                        formData.confirmPassword
                          ? "bg-green-400"
                          : "bg-lavender-600"
                      }`}
                    ></div>
                    Mật khẩu xác nhận khớp
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 px-4 rounded-xl font-heading font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang cập nhật...
                  </span>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lavender-300 font-body">
              Nhớ mật khẩu?{" "}
              <button
                type="button"
                onClick={() => navigate("/dang-nhap")}
                className="text-royal-400 hover:text-royal-300 font-heading font-semibold transition-colors duration-300"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
