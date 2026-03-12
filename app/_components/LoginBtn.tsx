"use client";

import { useState,  useRef } from "react";
import { useRouter } from "next/navigation";
import { getEmployeeByIdentity } from "@/lib/actions/employeesActions";
import { setSessionAction } from "@/lib/actions/sessionActions";
import { Button } from "@/components/ui/button";

const LoginBtn = () => {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();


  // Authenticates user by identity — routes admin to dashboard, employee to their profile
  const handleLogin = async () => {
    setError("");
    if (userInput === "123Test") {
      await setSessionAction("admin");
      router.push("/dashboard");
    } else {
      const employee = await getEmployeeByIdentity(userInput);
      if (employee) {
        await setSessionAction("employee", employee.id);
        router.push(`/profile/${employee.id}`);
      } else {
        setError("ID not found. Please try again.");
      }
    }
  };

  return (
    <div>
      <Button
        onClick={() => dialogRef.current?.showModal()}
        size="sm"
        variant="outline"
        className="hover:cursor-pointer"
      >
        Start Your Shift
      </Button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box bg-gray-100 rounded shadow-lg p-6 w-80">
          <form method="dialog">
            <Button
              size="sm"
              variant="outline"
              className="flex  justify-self-end hover:cursor-pointer"
            >
              ✕
            </Button>
          </form>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                SHIFT-SMART
              </p>
              <h3 className="text-base font-bold text-gray-900">
                Enter Your Employee ID
              </h3>
            </div>
            <input
              onChange={(e) => setUserInput(e.target.value)}
              type="text"
              placeholder="e.g. bradly@Test"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}

            <Button onClick={handleLogin} size="sm" variant="outline">
              Login
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default LoginBtn;
