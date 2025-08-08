import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Booking, Room, DateRange, RoomType } from "../types";

interface BookingState {
  selectedRoom: Room | null;
  dateRange: DateRange | null;
  bookings: Booking[];
  guests: number;
  roomType?: RoomType;
}

const initialState: BookingState = {
  selectedRoom: null,
  dateRange: null,
  bookings: [],
  guests: 1,
  roomType: 'all',
};

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
  },
});

export const {
  setSelectedRoom,
  setDateRange,
  setGuests,
  setRoomType,
  addBooking,
  updateBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
