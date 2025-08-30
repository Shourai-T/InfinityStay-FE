import axios from 'axios';
import { ResetPasswordPayload } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface LoginResponse {
  statusCode: number;
  message: string;
  result: {
    access_token: string;
    user: {
      firstName?: string;
      lastName?: string;
      email: string;
      phoneNumber?: string;
    }
  }
}

// Sửa lại hàm helper để decode JWT token và xử lý đúng các ký tự tiếng Việt
const decodeToken = (token: string): any => {
  try {
    // Base64 decode phần payload của token (phần thứ 2 sau dấu .)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64 thành chuỗi UTF-8
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return {};
  }
};

export const authService = {
  register: async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      console.log('Register API response:', response.data);
      return {
        success: true,
        data: response.data,
        user: response.data?.data // API trả về user trong data.data
      };
    } catch (error: any) {
      console.error('Register error response:', {
        status: error.response?.status,
        data: error.response?.data
      });
      throw error.response?.data || error;
    }
  },

  verifyOtp: async (data: {
    email: string;
    otp: string;
    type: string;
  }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, data);
      console.log('Verify OTP response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Verify OTP error:', {
        status: error.response?.status,
        data: error.response?.data
      });
      throw error.response?.data || error;
    }
  },

  verifyForgotPasswordOtp: async (data: { email: string; otp: string }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp-forgot-password`, data);
      console.log("Verify Forgot Password OTP response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Verify Forgot Password OTP error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error.response?.data || error;
    }
  },

  resendOtp: async (data: {
    email: string;
    type: string;
  }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/resend-otp`, data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Không thể gửi lại mã OTP';
      throw new Error(errorMessage);
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials, {
      withCredentials: true,
    });
      console.log('Login API response:', response.data);
      
      // Giải mã token để lấy thông tin role và các thông tin khác
      const decodedToken = decodeToken(response.data.result.access_token);
      console.log('Decoded token:', decodedToken);
      
      // Format lại response để phù hợp với state, bao gồm thông tin role
      return {
        statusCode: response.data.statusCode,
        message: response.data.message,
        data: {
          ...response.data.result.user,
          firstName: decodedToken.firstName || '',
          lastName: decodedToken.lastName || '',
          phoneNumber: decodedToken.phoneNumber || '',
          role: decodedToken.role || 'user',
          id: decodedToken._id || ''
        },
        token: response.data.result.access_token
      };
    } catch (error: any) {
      console.error('Login error response:', error.response?.data);
      throw error.response?.data || error;
    }
  },

  refresh: async () => {
    const res = await axios.post(`${API_URL}/auth/refresh`, {}, {
      withCredentials: true, // cookie refresh_token sẽ tự gửi
    });
    return res.data;
  },

  // Đổi mật khẩu mới sau khi xác thực OTP
  resetPassword: async (payload: ResetPasswordPayload) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, payload);
      return response.data;
    } catch (error: any) {
      console.error('Reset password error:', error.response?.data);
      throw error.response?.data || error;
    } 
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      // Trả về response.data (chứa statusCode, message, result)
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getProfile: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Get Profile API response:", response.data);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error("Get Profile error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error.response?.data || error;
    }
  },

  updateProfile: async (userData: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.patch(`${API_URL}/users/update-my-info`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Update Profile API response:', response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Update Profile error:', {
        status: error.response?.status,
        data: error.response?.data,
      });
      
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.error || 
        'Không thể cập nhật thông tin cá nhân';
      
      throw new Error(errorMessage);
    }
  },
};

// Axios config
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // cần có để gửi cookie refreshToken

// Axios interceptors để xử lý token và log requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
    });

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await authService.refresh(); 
        // API refresh trả về { access_token }

        const newToken = res.access_token;
        localStorage.setItem('token', newToken);

        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/dang-nhap';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
