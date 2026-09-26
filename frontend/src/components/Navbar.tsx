import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const location = useLocation();
  const { signOut } = useAuthContext();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { 
      label: "Operations", 
      path: "/operations",
      subItems: [
        { label: "Receipts", path: "/receipts" },
        { label: "Deliveries", path: "/deliveries" }
      ]
    },
    { label: "Stock", path: "/products" },
    { label: "Move History", path: "/move-history" },
    { 
      label: "Settings", 
      path: "/settings",
      subItems: [
        { label: "Warehouse", path: "/warehouse" },
        { label: "Locations", path: "/locations" }
      ]
    },
  ];

  const handleDropdownEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <div className="w-full max-w-[1400px] pt-4 px-4 sm:px-6 md:px-8 z-50">
      <header className="w-full bg-white rounded-t-[32px] rounded-b-[16px] shadow-sm border-2 border-[#EAE6DE] flex items-center justify-between px-6 py-3 md:px-8 md:py-4 relative">
        <div className="flex items-center gap-8 lg:gap-12 w-full">
          <div className="flex items-center gap-2 mr-4 md:mr-8">
            <div className="h-8 w-8 rounded-lg bg-[#292B2A] text-[#F5F2EC] flex items-center justify-center font-bold font-['Outfit'] text-lg shadow-sm">
              S
            </div>
          </div>

          <nav className="hidden md:flex flex-1 items-center gap-2 lg:gap-6 no-scrollbar" ref={dropdownRef}>
            {navItems.map((item) => {
              // Ensure we check exact match for dashboard, and startsWith for others
              const isDashboard = item.path === "/dashboard" && location.pathname === "/dashboard";
              const isActive = location.pathname.startsWith(item.path) && item.path !== "/";
              const currentlyActive = item.path === "/dashboard" ? isDashboard : isActive;
              const hasSubItems = !!item.subItems;

              return (
                <div 
                  key={item.path}
                  className="relative group"
                  onMouseEnter={() => hasSubItems && handleDropdownEnter(item.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={item.path}
                    className={`text-[15px] transition-colors relative whitespace-nowrap px-2 py-1.5 flex items-center gap-1 ${
                      currentlyActive 
                        ? "text-[#292B2A] font-semibold" 
                        : "text-[#73716C] font-medium hover:text-[#292B2A]"
                    }`}
                  >
                    {item.label}
                    {hasSubItems && (
                      <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    )}
                    {currentlyActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#A66A4C] rounded-full" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {hasSubItems && (
                    <div 
                      className={`absolute top-[calc(100%+0.5rem)] left-0 w-48 bg-white border-2 border-[#EAE6DE] rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top-left z-50 ${
                        activeDropdown === item.label ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                      }`}
                    >
                      <div className="py-2 flex flex-col">
                        {item.subItems?.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="px-4 py-2 text-sm text-[#73716C] hover:bg-[#F5F2EC] hover:text-[#292B2A] transition-colors font-medium"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="md:hidden">
             <span className="text-sm font-semibold text-[#292B2A] mr-4">Menu</span>
          </div>

          <Button 
            variant="outline" 
            className="h-10 w-10 rounded-xl border-2 border-[#EAE6DE] text-[#292B2A] hover:border-[#A66A4C] hover:bg-transparent transition-all p-0 flex items-center justify-center shadow-sm"
            onClick={() => {}}
            title="Profile"
          >
            <User size={18} strokeWidth={2.5} />
          </Button>
          
          <Button 
            variant="ghost" 
            className="h-10 px-3 rounded-xl text-[#A66A4C] hover:bg-[#F5F2EC] hover:text-[#292B2A] transition-colors"
            onClick={() => {
              try {
                if(signOut) signOut();
              } catch(e) {}
              window.location.href = '/login';
            }}
            title="Logout"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </header>
    </div>
  );
}
