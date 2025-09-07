import React, { useState, useEffect, useRef } from "react";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyOtp,
  resendOtp,
  verifyForgotPasswordOtp,
} from "../store/authSlice";
import type { RootState, AppDispatch } from "../store";

const API_URL =
  import.meta.env.VITE_API_URL || "https://infinity-stay.mtri.online/api";

export default function VerifyOTP() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email;
  const type = location.state?.type; // 'register' or 'forgot-password'

  useEffect(() => {
    if (!email || !type) {
      navigate("/dang-nhap");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, type, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    // Nếu dán vào input đầu tiên và value là 6 số, tự động điền các ô
    if (index === 0 && value.length === 6 && /^\d{6}$/.test(value)) {
      const newOtp = value.split("");
      setOtp(newOtp);
      // Focus vào ô cuối cùng
      inputRefs.current[5]?.focus();
      return;
    }
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !email) return;

    try {
      await dispatch(resendOtp({ email, type })).unwrap();
      showToast.success("Mã OTP mới đã được gửi");
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      showToast.error(error || "Không thể gửi lại mã OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      showToast.error("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    try {
      let verifyData = {
        email,
        otp: otpCode,
        type,
      };

      let url = "";
      if (type === "register") {
        url = API_URL + "/auth/verify-otp";
      } else if (type === "forgot-password") {
        url = API_URL + "/auth/verify-otp-forgot-password";
      }

      let result;
      if (type === "forgot-password") {
        result = await dispatch(verifyForgotPasswordOtp(verifyData)).unwrap();
      } else {
        result = await dispatch(verifyOtp(verifyData)).unwrap();
      }

      if (result.statusCode === 201) {
        showToast.success(result.result.message || "Xác thực thành công!");

        if (type === "forgot-password") {
          // Sau khi xác thực OTP quên mật khẩu, chuyển tới trang đặt lại mật khẩu
          navigate("/reset-password", {
            state: { email, resetToken: result.result.resetToken },
          });
        } else {
          // Sau khi verify đăng ký -> về đăng nhập
          navigate("/dang-nhap");
        }
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      showToast.error(error?.message || "Xác thực thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-luxury flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center fade-in-up">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-royal-400 hover:text-royal-300 mb-8 mx-auto transition-colors duration-300 font-body"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>

          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-royal rounded-2xl mb-6">
            <Shield className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-4xl font-display font-bold text-gradient mb-2">
            Xác thực OTP
          </h2>
          <p className="text-lg text-lavender-300 font-body mb-2">
            Mã OTP đã được gửi đến
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
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-heading font-medium text-lavender-300 mb-4 text-center">
                  Nhập mã OTP (6 số)
                </label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={index === 0 ? 6 : 1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onPaste={
                        index === 0
                          ? (e) => {
                              const paste = e.clipboardData.getData("text");
                              if (/^\d{6}$/.test(paste)) {
                                e.preventDefault();
                                handleOtpChange(0, paste);
                              }
                            }
                          : undefined
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-heading font-bold form-input rounded-xl border-2 border-royal-500/30 focus:border-royal-500"
                    />
                  ))}
                </div>
              </div>

              {/* Countdown */}
              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-royal-400 hover:text-royal-300 font-body transition-colors duration-300 flex items-center justify-center mx-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Gửi lại mã OTP
                  </button>
                ) : (
                  <p className="text-lavender-400 font-body">
                    Gửi lại mã sau {countdown}s
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 px-4 rounded-xl font-heading font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang xác thực...
                  </span>
                ) : type === "register" ? (
                  "Hoàn tất đăng ký"
                ) : (
                  "Xác thực OTP"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
