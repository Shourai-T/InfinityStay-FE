import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-luxury">
      <div className="card-luxury rounded-2xl p-10 text-center max-w-md">
        <X className="mx-auto h-16 w-16 text-red-400 mb-4" />
        <h1 className="text-3xl font-heading font-bold text-red-400 mb-2">
          Thanh toán thất bại
        </h1>
        <p className="text-lavender-300 mb-6">
          Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc chọn
          phương thức khác.
        </p>
        <button
          onClick={() => navigate("/dat-phong")}
          className="btn-gold px-6 py-3 rounded-xl font-heading font-semibold"
        >
          Quay về trang đặt phòng
        </button>
      </div>
    </div>
  );
}
