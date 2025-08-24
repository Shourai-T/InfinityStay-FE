import { Socket, io } from "socket.io-client";
import { showToast } from "../utils/toast";

// Socket instance for reuse
let socket: Socket | null = null;

// Socket connection options
const socketOptions = {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  forceNew: true,
};

/**
 * Connect to payment WebSocket server and listen for payment events
 * @param email User's email to join the transaction channel
 * @param onPaymentUrl Callback function when payment URL is received
 * @returns Cleanup function to disconnect socket
 */
export const connectPaymentSocket = (
  email: string,
  onPaymentUrl: (url: string) => void
): (() => void) => {
  // Close any existing connection
  if (socket) {
    socket.disconnect();
  }

  console.log("Attempting to connect to WebSocket server...");
  console.log("Email being used for connection:", email);

  // Connect to the WebSocket server
  socket = io("wss://infinity-stay.mtri.online/transactions", socketOptions);

  // Log successful connection
  socket.on("connect", () => {
    console.log("Socket connected successfully with ID:", socket?.id);

    // Join the transaction channel with user email after successful connection
    if (socket) {
      socket.emit("join", email);
      console.log("Emitted join event with email:", email);
    }
  });

  // Listen for all events (debugging)
  socket.onAny((event: string, ...args: any[]) => {
    console.log(`Socket event received: ${event}`, args);
  });

  // Listen for payment URL
  socket.on("paymentUrl", (data: any) => {
    console.log("Payment URL event received!", data);

    try {
      // Handle ZaloPay structure: {bookingId, payUrl}
      if (data && typeof data === "object" && data.payUrl) {
        console.log("Found ZaloPay payment URL:", data.payUrl);
        onPaymentUrl(data.payUrl);
      }
      // Fallback for direct string URL
      else if (typeof data === "string") {
        onPaymentUrl(data);
      } else {
        console.warn("Unexpected payment URL format:", data);
        showToast.warning(
          "Không thể tạo liên kết thanh toán. Vui lòng thử lại sau."
        );
      }
    } catch (error) {
      console.error("Error processing payment URL data:", error);
      showToast.error("Đã xảy ra lỗi khi xử lý dữ liệu thanh toán.");
    }
  });

  // Handle connection errors with more detailed logging
  socket.on("connect_error", (error: any) => {
    console.error("Socket connection error:", error.message);
    showToast.error(
      "Không thể kết nối đến máy chủ thanh toán. Vui lòng thử lại sau."
    );
  });

  // Handle transport errors specifically
  socket.on("error", (error: any) => {
    console.error("Socket transport error:", error);
    // Try to reconnect manually if socket.io's automatic reconnection fails
    setTimeout(() => {
      if (socket && !socket.connected) {
        console.log("Attempting manual reconnection...");
        socket.connect();
      }
    }, 3000);
  });

  // Handle disconnection
  socket.on("disconnect", (reason: string) => {
    console.log("Socket disconnected:", reason);
    if (reason === "io server disconnect" || reason === "transport close") {
      // If the server disconnected us, try to reconnect manually
      setTimeout(() => {
        console.log("Attempting to reconnect after disconnection...");
        if (socket) socket.connect();
      }, 2000);
    }
  });

  // Return a cleanup function
  return () => {
    if (socket) {
      console.log("Cleaning up socket connection");
      socket.disconnect();
      socket = null;
    }
  };
};

/**
 * Disconnect the payment socket if it exists
 */
export const disconnectPaymentSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
