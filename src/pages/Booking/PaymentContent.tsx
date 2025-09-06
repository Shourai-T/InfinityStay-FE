import React from "react";
import { Check, Copy, X, ExternalLink } from "lucide-react";

interface PaymentContentProps {
  paymentMethod: "online";
  isGeneratingQR: boolean;
  paymentUrl: string;
  paymentStatus: "pending" | "checking" | "success" | "failed";
  checkPaymentStatus: () => void;
}

const PaymentContent: React.FC<PaymentContentProps> = ({
  paymentMethod,
  isGeneratingQR,
  paymentUrl,
  paymentStatus,
  checkPaymentStatus,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Only show for online payments
  if (paymentMethod !== "online") return null;

  return (
    <div className="space-y-6">
      {/* Payment Section */}
      <div className="mt-6 card-luxury rounded-xl p-6 text-center">
        <h4 className="font-semibold font-body text-white mb-4">
          Thanh toán đặt phòng
        </h4>

        {isGeneratingQR ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-royal-500"></div>
            <p className="text-lavender-300">Đang khởi tạo thanh toán...</p>
          </div>
        ) : paymentUrl ? (
          <div className="space-y-4">
            {/* Payment Button/Link */}
            <div className="bg-royal-500/10 rounded-lg p-8 w-full text-center">
              <p className="text-lavender-300 mb-4">
                Nhấn vào nút bên dưới để tiến hành thanh toán qua ZaloPay
              </p>
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center px-6 py-3 rounded-xl font-heading font-semibold"
              >
                <span>Thanh toán ngay</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>

            {/* Copy URL Section */}
            <div className="bg-royal-500/10 rounded-lg p-4">
              <p className="text-sm text-lavender-300 mb-2">
                Hoặc sao chép liên kết:
              </p>
              <div className="flex items-center justify-center space-x-2">
                <code className="bg-midnight-800 px-3 py-2 rounded font-mono text-lavender-300 font-semibold text-xs truncate max-w-[250px]">
                  {paymentUrl}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(paymentUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-2 hover:bg-royal-500/20 rounded transition-colors duration-300"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-lavender-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-royal-500/10 rounded-lg p-8 w-full text-center">
            <p className="text-red-400 mb-4">
              Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.
            </p>
            <button
              onClick={checkPaymentStatus}
              className="btn-gold px-8 py-3 rounded-xl font-heading font-semibold"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>

      {/* Payment Instructions - Simplified for ZaloPay */}
      <div className="card-luxury rounded-xl p-6 border border-royal-500/10">
        <h4 className="font-heading font-semibold text-white mb-4">
          Hướng dẫn thanh toán
        </h4>
        <ol className="space-y-2 text-sm text-lavender-300">
          <li className="flex items-start space-x-2">
            <span className="bg-royal-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">
              1
            </span>
            <span>Nhấn nút "Thanh toán ngay" để mở ZaloPay</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="bg-royal-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">
              2
            </span>
            <span>
              Xác nhận thông tin và hoàn tất thanh toán trong ứng dụng ZaloPay
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="bg-royal-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mt-0.5">
              3
            </span>
            <span>
              Sau khi thanh toán, nhấn "Kiểm tra thanh toán" ở bên dưới
            </span>
          </li>
        </ol>
      </div>

      {/* Payment Status */}
      <div className="text-center">
        {paymentStatus === "pending" && (
          <button
            onClick={checkPaymentStatus}
            className="btn-gold px-8 py-3 rounded-xl font-heading font-semibold"
          >
            Kiểm tra thanh toán
          </button>
        )}

        {paymentStatus === "checking" && (
          <div className="flex items-center justify-center space-x-3 text-infinity-400">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-infinity-400"></div>
            <span className="font-body">Đang kiểm tra thanh toán...</span>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="text-green-400 font-body">
            <Check className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">Thanh toán thành công!</p>
            <p className="text-sm">Đang chuyển hướng...</p>
          </div>
        )}

        {/* {paymentStatus === "failed" && (
          <div className="text-red-400 font-body">
            <X className="h-8 w-8 mx-auto mb-2" />
            <p className="font-semibold">Thanh toán thất bại</p>
            <p className="text-sm mb-4">Vui lòng thử lại</p>
            <button
              onClick={checkPaymentStatus}
              className="btn-gold px-8 py-3 rounded-xl font-heading font-semibold"
            >
              Kiểm tra thanh toán
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default PaymentContent;
