import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LayoutDashboard, Component, Sparkles } from "lucide-react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Components", path: "/components", icon: Component },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/60 bg-card/60 backdrop-blur-md hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/60">
          <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black shadow-sm">
              H
            </div>
            <span>Hackathon App</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-2.5 font-medium transition-all ${
                  isActive ? "bg-secondary text-secondary-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
                asChild
              >
                <Link to={item.path}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/60 bg-card/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Dual Theme Ready</span>
          </div>
          <ThemeToggle variant="icon" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border/60 flex items-center justify-between px-6 bg-card/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2 font-bold">
              <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-black">
                H
              </div>
              <span>Hackathon</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight hidden md:block">
              {location.pathname === "/components" ? "UI Components & Gallery" : "Overview & Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Navigation on Mobile */}
            <div className="flex md:hidden items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dash</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/components">Components</Link>
              </Button>
            </div>

            {/* Segmented Theme Switcher */}
            <ThemeToggle variant="segmented" />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
