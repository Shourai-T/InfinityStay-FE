import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";
import { AuthState, RegisterPayload, ResetPasswordPayload } from "../types";


const initialState: AuthState = {
  user: (() => {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === "undefined") return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  role: localStorage.getItem('role') || 'user', // Mặc định là 'user'
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      // console.log('Register thunk - sending data:', userData);
      const response = await authService.register(userData);
      // console.log('Register thunk - response:', response);
      return response;
    } catch (error: any) {
      console.error('Register thunk - error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Đăng ký thất bại"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data: {email: string; otp: string; type: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Xác thực thất bại");
    }
  }
);


export const verifyForgotPasswordOtp = createAsyncThunk(
  "auth/verifyForgotPasswordOtp",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyForgotPasswordOtp(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Xác thực thất bại");
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data: { email: string; type: string }, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Không thể gửi lại mã OTP");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      return await authService.resetPassword(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Lỗi hệ thống" });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // console.log('Login thunk - sending data:', credentials);
      const response = await authService.login(credentials);
      // console.log('Login thunk - response:', response);
      return response;
    } catch (error: any) {
      console.error('Login thunk - error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Đăng nhập thất bại"
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refresh();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể refresh token"
      );
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await authService.getProfile(token);
      return res;
    } catch (error: any) {
      return rejectWithValue(error.res?.data || "Lấy thông tin thất bại");
    }
  }
);

// Add new updateUserInfo action
export const updateUserInfo = createAsyncThunk(
  "auth/updateUserInfo",
  async (userData: { firstName?: string; lastName?: string; phoneNumber?: string }, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(userData);
      const updateUser = response.data.result;
      localStorage.setItem("user", JSON.stringify(updateUser));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update user information");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.role = 'user'; // Reset role về mặc định
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          id: action.payload.data.id ?? "",
          firstName: action.payload.data.firstName,
          lastName: action.payload.data.lastName,
          email: action.payload.data.email,
          phoneNumber: action.payload.data.phoneNumber,
          role: action.payload.data.role || 'user'
        };
        localStorage.setItem('user', JSON.stringify(state.user));
        if (action.payload.data && action.payload.data.token) {
          state.token = action.payload.data.token;
          localStorage.setItem('token', action.payload.data.token);
        }

      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        if (action.payload.data && action.payload.data.token) {
          state.token = action.payload.data.token;
          localStorage.setItem('token', action.payload.data.token);
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.role = action.payload.data.role || 'user';
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        localStorage.setItem('role', action.payload.data.role || 'user');
        if (action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Đổi mật khẩu thất bại";
      })
      // REFRESH TOKEN
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload.access_token) {
          state.token = action.payload.access_token;
          localStorage.setItem("token", action.payload.access_token);
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.token = null;
        localStorage.removeItem("token");
        state.error = action.payload as string;
      })
      // getUser
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.result;
        localStorage.setItem("user", JSON.stringify(action.payload.data.result));
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateUserInfo
      .addCase(updateUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.result;
        localStorage.setItem("user", JSON.stringify(action.payload.data.result));
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;