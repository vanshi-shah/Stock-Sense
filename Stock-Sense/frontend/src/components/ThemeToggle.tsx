import React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme, Theme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemeToggleProps {
  variant?: "icon" | "segmented";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();

  if (variant === "segmented") {
    const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
      { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
      { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
      { value: "system", label: "System", icon: <Laptop className="h-4 w-4" /> },
    ];

    return (
      <div className={`inline-flex items-center rounded-lg border bg-muted p-1 ${className}`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              theme === opt.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={`Set ${opt.label} theme`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={`relative h-9 w-9 p-0 rounded-full border-border/80 hover:bg-accent transition-transform active:scale-95 ${className}`}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">
            Current: <span className="font-semibold capitalize">{theme}</span> (
            {resolvedTheme} active) — Click to switch
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
