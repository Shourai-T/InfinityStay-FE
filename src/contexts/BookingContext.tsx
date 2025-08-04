import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Room, Booking, DateRange } from "../types";

interface BookingState {
  selectedRoom: Room | null;
  dateRange: DateRange | null;
  bookings: Booking[];
}

type BookingAction =
  | { type: "SET_SELECTED_ROOM"; payload: Room | null }
  | { type: "SET_DATE_RANGE"; payload: DateRange | null }
  | { type: "ADD_BOOKING"; payload: Booking }
  | {
      type: "UPDATE_BOOKING";
      payload: { id: string; updates: Partial<Booking> };
    };

const initialState: BookingState = {
  selectedRoom: null,
  dateRange: null,
  bookings: [],
};

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | null>(null);

function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "SET_SELECTED_ROOM":
      return { ...state, selectedRoom: action.payload };
    case "SET_DATE_RANGE":
      return { ...state, dateRange: action.payload };
    case "ADD_BOOKING":
      return { ...state, bookings: [...state.bookings, action.payload] };
    case "UPDATE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload.id
            ? { ...booking, ...action.payload.updates }
            : booking
        ),
      };
    default:
      return state;
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}
