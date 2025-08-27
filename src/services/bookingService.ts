import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const bookingService = {
  createBooking: async (bookingData: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    typeBooking: string;
    note: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/booking`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Create Booking error:', {
        status: error.response?.status,
        data: error.response?.data
      });
      throw error.response?.data || error;
    }
  },

  getMyBookings: async (params?: { limit?: number; page?: number }) => {
    try {
      const token = localStorage.getItem('token');
      const { limit = 10, page = 1 } = params || {};
      
      const response = await axios.get(`${API_URL}/booking/get-my-bookings`, {
        params: { limit, page },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Get My Bookings error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn');
      }
      
      throw error.response?.data || { message: error.message || 'Lỗi khi lấy danh sách booking' };
    }
  },

  getBookingById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/booking/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  updateBooking: async (id: string, data: any) => {
    try {
      const response = await axios.put(`${API_URL}/booking/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  cancelBooking: async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_URL}/booking/cancel/${bookingId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Cancel Booking error:', {
        status: error.response?.status,
        data: error.response?.data
      });
      throw error.response?.data || error;
    }
  },

};

// Also export as default for alternative import methods
export default bookingService;
