import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#F5F2EC] text-[#252525] font-['Inter'] selection:bg-[#B7A58A] selection:text-white flex flex-col items-center">
      
      {/* Top Navigation Bar Container */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] px-4 sm:px-6 md:px-8 mt-4 md:mt-8 pb-12 overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
