import React, { useState } from "react";
import { Mail, ArrowLeft, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { authService } from "../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast.error("Vui lòng nhập email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast.error("Email không hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      // Gọi đúng API forgotPassword
      await authService.forgotPassword(email);
      showToast.success("Mã OTP đã được gửi đến email của bạn");
      navigate("/verify-otp", {
        state: {
          email,
          type: "forgot-password",
        },
      });
    } catch (error: any) {
      showToast.error(error.message || "Gửi mã OTP thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-luxury flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center fade-in-up">
          <h2 className="text-4xl font-display font-bold text-gradient mb-2">
            Quên mật khẩu
          </h2>
          <p className="text-lg text-lavender-300 font-body">
            Nhập email để nhận mã OTP khôi phục mật khẩu
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
                  Email đã đăng ký
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-royal-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input w-full pl-12 pr-4 py-4 rounded-xl font-body"
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 px-4 rounded-xl font-heading font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang gửi mã OTP...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Send className="h-5 w-5 mr-2" />
                    Gửi mã OTP
                  </span>
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
