"use client";

import { useEffect } from "react";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      reset();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-3 border p-10 bg-gray-700 rounded shadow">
        <div className="inline-grid *:[grid-area:1/1]">
          <div className="status status-error animate-ping"></div>
          <div className="status status-error"></div>
        </div>
        <p className="text-sm font-semibold text-red-500 border-b border-cyan-300">
          {error.message}
        </p>
        <p className="text-xs text-gray-400">
          please contact your nearest Administrator
        </p>
      </div>
    </div>
  );
};

export default Error;
