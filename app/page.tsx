import LoginBtn from "./_components/LoginBtn";
import { getSessionAction } from "@/lib/actions/sessionActions";
import { redirect } from "next/navigation";

export default async function Home() {
  const { role, employeeId } = await getSessionAction();

  if (role === "admin") {
    redirect("/dashboard");
  } else if (role === "employee") {
    redirect(`/profile/${employeeId}`);
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[80vh]">
        <img
          src="/BG-img.jpg"
          alt="HR-Pro"
          className="w-full h-full rounded hover:translate-y-1  object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center mt-30 justify-center gap-4 px-4 text-center">
          <p className="text-white/70 text-xs uppercase tracking-widest">
            Your workforce, organized
          </p>
          <h1 className="text-white text-4xl font-bold">
            sHifT-sM<span className="text-cyan-400">a</span>
            Rt
          </h1>
          <p className="text-white/60 text-sm max-w-sm">
            One place to manage your team, track shifts, and stay on top of
            who's working.
          </p>
          <LoginBtn />
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gray-200 border border-gray-100 rounded-xl p-6">
          <p className="text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">
            Shift Tracking
          </p>
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            Clock in and out in one tap
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            No paperwork, no confusion. Every employee clocks in through their
            own profile and their time is logged instantly.
          </p>
        </div>
        <div className="bg-gray-200 border border-gray-100 rounded-xl p-6">
          <p className="text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">
            Weekly Hours
          </p>
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            Know exactly who worked what
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Employees see their own hours. Admins see everyone's. Weekly
            summaries make payroll and planning a lot easier.
          </p>
        </div>
        <div className="bg-gray-200 border border-gray-100 rounded-xl p-6">
          <p className="text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-2">
            Team Management
          </p>
          <h3 className="text-sm  font-bold text-gray-900 mb-2">
            Built for the person running things
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Add new staff, update roles, remove people who've left. The admin
            has full control without needing a developer.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-100 border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-400">
          © 2026 SHIFT-SMART — built for teams that show up.
        </p>
      </div>
    </main>
  );
}
