import React from "react";

export default function Notification({ notification }) {
  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-sm shadow-lg z-50 ${
        notification.type === "error" ? "bg-black" : "bg-black"
      } text-white border border-gray-200`}
    >
      {notification.message}
    </div>
  );
}
