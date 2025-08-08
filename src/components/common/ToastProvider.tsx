import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ToastProvider: React.FC = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName="toast-container"
      // bodyClassName="toast-body"
      progressClassName="toast-progress"
      style={{
        fontSize: "14px",
        fontFamily: "Poppins, sans-serif",
      }}
    />
  );
};
