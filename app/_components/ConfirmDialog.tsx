"use client";

import { useEffect, useRef } from "react";
import { ConfirmDialogProps } from "@/types";

const ConfirmDialog = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {



    const dialogRef = useRef<HTMLDialogElement>(null);

  // Opens or closes the dialog based on the isOpen prop.
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
     <dialog ref={dialogRef} className="modal">
      <div className="modal-box bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-80">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Are you sure?</h3>
        <p className="text-xs text-gray-400 mb-6">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
          >
            Yes, go ahead
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  );
};

export default ConfirmDialog;
