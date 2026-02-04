"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { API_BASE_URL } from "@/utils/constants";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchRole() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRole(data.role);
      } catch {
        setRole(null);
      }
    }
    fetchRole();
  }, [token, router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  const isActive = (path: string) => pathname.includes(path);

  const containerClass = "max-w-[1000px] mx-auto px-4 md:px-6";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className={`${containerClass} flex items-center justify-between py-2`}>
        <div className="flex items-center gap-4 md:gap-10">
          {/* Logo - Slightly smaller on mobile to save space */}
          <div className="cursor-pointer shrink-0" onClick={() => router.push("/dashboard/project")}>
            <img src="/logo.png" alt="ManageBug" className="h-4 md:h-5 object-contain" />
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            {/* PROJECTS BUTTON */}
            <button 
              onClick={() => router.push("/dashboard/project")} 
              className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${
                isActive("/dashboard/project") ? "text-[#3B82F6]" : "text-[#94A3B8] hover:text-[#3B82F6]"
              }`}
            >
              <img 
                src="/projects.png" 
                alt="" 
                className={`h-3.5 w-3.5 ${isActive("/dashboard/project") ? "" : "opacity-50"}`} 
              />
              {/* Text hidden on small mobile, shown on tablet/desktop */}
              <span className="hidden sm:inline">Projects</span>
            </button>

            {/* BUGS BUTTON */}
            <button 
              onClick={() => router.push(`/dashboard/bugs`)} 
              className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${
                isActive("/dashboard/bugs") ? "text-[#3B82F6]" : "text-[#94A3B8] hover:text-[#3B82F6]"
              }`}
            >
              <img 
                src="/bug.png" 
                alt="" 
                className={`h-3.5 ${isActive("/dashboard/bugs") ? "" : "opacity-50"}`} 
              />
              {/* Text hidden on small mobile, shown on tablet/desktop */}
              <span className="hidden sm:inline">Bugs</span>
            </button>
          </div>
        </div>

        {/* User Profile Area */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* BELL ICON - Completely hidden on mobile view */}
          <div className="hidden md:block">
             <Bell size={16} className="text-[#94A3B8] cursor-pointer" />
          </div>

          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center gap-1.5 md:gap-2 bg-[#F8FAFC] px-2 py-1 rounded-md border border-gray-100 cursor-pointer"
            >
              <div className="w-5 h-5 md:w-6 md:h-6 bg-[#0F172A] rounded-md flex items-center justify-center text-white text-[9px] md:text-[10px] font-bold">
                {role ? role[0].toUpperCase() : "U"}
              </div>
              {/* Role text - kept short for mobile */}
              <span className="text-[10px] md:text-[11px] font-bold text-[#1E293B]">
                {role?.toUpperCase() || "USER"}.
              </span>
              <ChevronDown className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} size={10} />
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                <button 
                  onClick={() => { setIsProfileOpen(false); router.push("/dashboard/profile"); }} 
                  className="w-full text-left px-3 py-1.5 text-[11px] flex items-center gap-2 hover:bg-gray-50 border-b border-gray-50"
                >
                  <User size={12} /> Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-3 py-1.5 text-[11px] text-red-500 flex items-center gap-2 hover:bg-red-50"
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}