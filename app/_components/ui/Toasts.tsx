"use client";

import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { VscError } from "react-icons/vsc";

const Toasts = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: string;
  onClose: () => void;
}) => {
  // Auto-dismisses the toast after 5 seconds.
  useEffect(() => {
    const timeout = setTimeout(onClose, 50000);
    return () => clearTimeout(timeout);
  }, [onClose,]);

  return (
    <div className="toast toast-top toast-end mt-20">
      <div
        className={`alert  font-bold  ${type === "success" ? "alert-success text-black bg-green-100 border border-green-600 " : "alert-error text-black border border-red-700 bg-red-200"}`}
      >
        <span>
          <div className="flex items-center gap-1">
            {type === "success" ? (
              <FaCheckCircle className="text-lg text-green-500" />
            ) : (
              <>
                <VscError className="text-lg text-red-700" />
              </>
            )}
            {message}
          </div>
        </span>
      </div>
    </div>
  );
};

export default Toasts;
