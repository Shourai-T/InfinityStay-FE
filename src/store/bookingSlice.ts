import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Booking, Room, DateRange, RoomType } from "../types";
import { bookingService } from "../services/bookingService";

interface BookingState {
  selectedRoom: Room | null;
  dateRange: DateRange | null;
  bookings: Booking[];
  guests: number;
  roomType?: RoomType;
  paymentMethod: "online" | "onsite";
  paymentStatus: "idle" | "pending" | "success" | "failed";
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  selectedRoom: null,
  dateRange: null,
  bookings: [],
  guests: 1,
  roomType: "all",
  paymentMethod: "online",
  paymentStatus: "idle",
  loading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    typeBooking: string;
    note: string;
  }, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(bookingData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Tạo booking thất bại");
    }
  }
);

export const getMyBookings = createAsyncThunk(
  "booking/getMyBookings",
  async (
    args: { params?: { limit?: number; page?: number } },
    { rejectWithValue }
  ) => {
    try {
      const response = await bookingService.getMyBookings(args.params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lấy danh sách booking thất bại");
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await bookingService.cancelBooking(bookingId);
      return { bookingId, response };
    } catch (error: any) {
      return rejectWithValue(error.message || "Hủy booking thất bại");
    }
  }
);


export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      state.selectedRoom = action.payload;
    },
    setDateRange: (state, action: PayloadAction<DateRange | null>) => {
      state.dateRange = action.payload;
    },
    setGuests(state, action: PayloadAction<number>) {
      state.guests = action.payload;
    },
    setRoomType(state, action: PayloadAction<RoomType>) {
      state.roomType = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<"online" | "onsite">) {
      state.paymentMethod = action.payload;
    },
    setPaymentStatus(
      state,
      action: PayloadAction<"idle" | "pending" | "success" | "failed">
    ) {
      state.paymentStatus = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Booking>;
      }>
    ) => {
      const index = state.bookings.findIndex(
        (booking) => booking.id === action.payload.id
      );
      if (index !== -1) {
        state.bookings[index] = {
          ...state.bookings[index],
          ...action.payload.updates,
        };
      }
    },
    updateBookingStatus: (
      state,
      action: PayloadAction<{ id: string; status: Booking["status"] }>
    ) => {
      const index = state.bookings.findIndex(
        (booking) => booking.id === action.payload.id
      );
      if (index !== -1) {
        state.bookings[index].status = action.payload.status;
      }
    },
    removeBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter(
        (booking) => booking.id !== action.payload
      );
    },
    resetBookingState: (state) => {
      state.selectedRoom = null;
      state.dateRange = null;
      state.guests = 1;
      state.paymentMethod = "online";
      state.paymentStatus = "idle";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.paymentStatus = "pending";
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.paymentStatus = "success";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.paymentStatus = "failed";
      })
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.bookings = action.payload.result;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.bookings = [];
      })
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update the booking status to canceled using bookingId
        const index = state.bookings.findIndex(
          (booking: any) => booking.bookingId === action.payload.bookingId
        );
        if (index !== -1) {
          state.bookings[index].status = "canceled";
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const {
  setSelectedRoom,
  setDateRange,
  setGuests,
  setRoomType,
  setPaymentMethod,
  setPaymentStatus,
  addBooking,
  updateBooking,
  updateBookingStatus,
  removeBooking,
  resetBookingState,
  clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
