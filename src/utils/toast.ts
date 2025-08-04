import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, Calendar, CreditCard, User } from 'lucide-react';

// Custom toast with icons
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      icon: '✅',
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '600',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      icon: '❌',
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '600',
      },
    });
  },

  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        fontWeight: '600',
      },
    });
  },

  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: '600',
      },
    });
  },

  // Specialized toasts for booking flow
  dateRequired: () => {
    toast.error('Vui lòng chọn ngày nhận và trả phòng', {
      icon: '📅',
      duration: 5000,
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '600',
      },
    });
  },

  loginRequired: () => {
    toast.error('Vui lòng đăng nhập để đặt phòng', {
      icon: '👤',
      duration: 5000,
      style: {
        background: '#F59E0B',
        color: '#fff',
        fontWeight: '600',
      },
    });
  },

  bookingSuccess: (bookingId: string) => {
    toast.success(`Đặt phòng thành công! Mã đặt phòng: ${bookingId}`, {
      icon: '🎉',
      duration: 6000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '600',
      },
    });
  },

  bookingCancelled: () => {
    toast.success('Đã hủy đặt phòng thành công', {
      icon: '✅',
      duration: 4000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '600',
      },
    });
  },

  paymentProcessing: () => {
    return toast.loading('Đang xử lý thanh toán...', {
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: '600',
      },
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
      loading: {
        message: loading,
        style: {
          background: '#3B82F6',
          color: '#fff',
          fontWeight: '600',
        },
      },
      success: {
        message: success,
        style: {
          background: '#10B981',
          color: '#fff',
          fontWeight: '600',
        },
      },
      error: {
        message: error,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontWeight: '600',
        },
      },
    });
  },
};