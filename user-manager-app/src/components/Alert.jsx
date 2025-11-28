import React, { useEffect } from "react";
import Swal from "sweetalert2";

export default function Alert({ message, type = "success", duration = 3000, onClose }) {
  useEffect(() => {
    if (!message) return;

    Swal.fire({
      text: message,
      icon: type, // "success", "error", "warning", "info", "question"
      position: "top-end",
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      toast: true,
      background: type === "success" ? "#dcfce7" : "#fee2e2",
      color: type === "success" ? "#166534" : "#991b1b",
      width: 350, // lebih lebar
      padding: "1rem 1.5rem", // lebih lega
      customClass: {
        title: "text-lg font-semibold", // teks lebih besar
        popup: "shadow-xl rounded-xl" // modern rounded + shadow
      },
      didClose: () => {
        if (onClose) onClose();
      },
    });
  }, [message, type, duration, onClose]);

  return null;
}
