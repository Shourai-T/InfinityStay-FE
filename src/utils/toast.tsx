import { toast, ToastOptions } from "react-toastify";

// Custom toast configurations
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const successOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 4000,
  className: "toast-success",
};

const errorOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 5000,
  className: "toast-error",
};

const warningOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 4500,
  className: "toast-warning",
};

const infoOptions: ToastOptions = {
  ...defaultOptions,
  autoClose: 4000,
  className: "toast-info",
};

// Custom toast with icons and styling
export const showToast = {
  success: (message: string) => {
    toast.success(`${message}`, successOptions);
  },

  error: (message: string) => {
    toast.error(`${message}`, errorOptions);
  },

  warning: (message: string) => {
    toast.warning(`${message}`, warningOptions);
  },

  info: (message: string) => {
    toast.info(`${message}`, infoOptions);
  },

  // Specialized toasts for booking flow
  dateRequired: () => {
    toast.error("Vui lòng chọn ngày nhận và trả phòng", {
      ...errorOptions,
      autoClose: 5000,
      className: "toast-date-required",
    });
  },

  loginRequired: () => {
    toast.warning("Vui lòng đăng nhập để đặt phòng", {
      ...warningOptions,
      autoClose: 5000,
      className: "toast-login-required",
    });
  },

  bookingSuccess: (bookingId: string) => {
    toast.success(`Đặt phòng thành công! Mã đặt phòng: ${bookingId}`, {
      ...successOptions,
      autoClose: 6000,
      className: "toast-booking-success",
    });
  },

  bookingCancelled: () => {
    toast.success("Đã hủy đặt phòng thành công", {
      ...successOptions,
      autoClose: 4000,
      className: "toast-booking-cancelled",
    });
  },

  paymentProcessing: () => {
    return toast.loading("Đang xử lý thanh toán...", {
      position: "top-right",
      theme: "dark",
      className: "toast-payment-processing",
    });
  },

  // Promise-based toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      pending: {
        render: `${loading}`,
        ...defaultOptions,
        className: "toast-promise-pending",
      },
      success: {
        render: `${success}`,
        ...successOptions,
        className: "toast-promise-success",
      },
      error: {
        render: `${error}`,
        ...errorOptions,
        className: "toast-promise-error",
      },
    });
  },

  // Custom toast for room booking with room info
  roomBookingSuccess: (roomName: string, bookingId: string) => {
    toast.success(
      <div className="flex flex-col">
        <div className="font-heading font-semibold text-white mb-1">
          Đặt phòng thành công!
        </div>
        <div className="text-sm text-green-100">
          {roomName} - Mã: {bookingId}
        </div>
      </div>,
      {
        ...successOptions,
        autoClose: 6000,
        className: "toast-room-booking-success",
      }
    );
  },

  // Custom toast for login success with user name
  loginSuccess: (userName: string) => {
    toast.success(
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-royal-500 to-infinity-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm font-bold">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-heading font-semibold text-white">
            Chào mừng {userName}!
          </div>
          <div className="text-sm text-green-100">Đăng nhập thành công</div>
        </div>
      </div>,
      {
        ...successOptions,
        autoClose: 5000,
        className: "toast-login-success",
      }
    );
  },
};
