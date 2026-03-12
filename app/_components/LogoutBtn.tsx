"use client";

import { useRouter } from "next/navigation";
import { clearSessionAction } from "@/lib/actions/sessionActions";
import { Button } from "@/components/ui/button";

const LogoutBtn = () => {
  const router = useRouter();

  // Clears the session cookie and redirects to the landing page
  const handleLogout = async () => {
    await clearSessionAction();
    router.push("/");
  };

  return (
    <Button
      onClick={handleLogout}
      size="sm"
      variant="outline"
      className="text-xs text-gray-600 border border-cyan-400  px-3 py-1.5 rounded-md hover:bg-gray-50 hover:cursor-pointer transition-colors"
    >
      Log out
    </Button>
  );
};

export default LogoutBtn;
