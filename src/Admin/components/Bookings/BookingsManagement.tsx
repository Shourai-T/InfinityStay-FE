import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface BookingEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: { status: string; amount: number };
}

interface BookingsManagementProps {
  bookings: BookingEvent[];
}

const localizer = momentLocalizer(moment);

const BookingsManagement: React.FC<BookingsManagementProps> = ({
  bookings,
}) => {
  const eventStyleGetter = (event: any) => {
    const backgroundColor =
      event.resource.status === "confirmed" ? "#10b981" : "#f59e0b";
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-gradient mb-2">
          Quản lý đặt phòng
        </h1>
        <p className="text-lavender-300 font-body">
          Lịch và danh sách đặt phòng
        </p>
      </div>

      <div className="card-luxury rounded-2xl p-8">
        <div className="bg-white rounded-xl p-4" style={{ height: "600px" }}>
          <Calendar
            localizer={localizer}
            events={bookings}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            views={["month", "week", "day"]}
            defaultView="month"
            popup
            style={{ height: "100%", color: "black" }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;
