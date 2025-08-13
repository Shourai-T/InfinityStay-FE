import React, { useState, useEffect, useRef } from "react";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { showToast } from "../utils/toast";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
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
    if (!canResend) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      showToast.success("Mã OTP mới đã được gửi");
      setCountdown(60);
      setCanResend(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      showToast.error("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (type === "register") {
        const user = {
          id: Date.now().toString(),
          name: email.split("@")[0],
          email: email,
        };
        dispatch({ type: "SET_USER", payload: user });
        showToast.success("Đăng ký thành công!");
        navigate("/");
      } else {
        // For forgot password, go to new password page
        navigate("/reset-password", { state: { email, otpVerified: true } });
      }
      setIsLoading(false);
    }, 1500);
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
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
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
