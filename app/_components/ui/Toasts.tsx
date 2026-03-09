"use client";

import { useEffect } from "react";

const Toasts = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timeout = setTimeout(onClose, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="toast toast-top toast-end mt-20">
      <div
        className={`alert ${type === "success" ? "alert-success" : "alert-error"}`}
      >
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toasts;
