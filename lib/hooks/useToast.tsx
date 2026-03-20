import { useState } from "react";
import Toasts from "@/app/_components/ui/Toasts";

export const useToast = () => {
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null,
  );

  const showToast = (result: { success: boolean; message: string }) => {
    setToast({
      message: result.message,
      type: result.success ? "success" : "error",
    });
  };

  const ToastElement = toast ? (
    <Toasts
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { toast, setToast, showToast, ToastElement };
};
