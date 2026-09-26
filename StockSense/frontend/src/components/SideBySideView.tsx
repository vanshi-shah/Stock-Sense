import React, { useState } from "react";
import { Sun, Moon, Columns2, Rows2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SideBySideViewProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SideBySideView({
  title,
  description,
  children,
  className = "",
}: SideBySideViewProps) {
  const [layout, setLayout] = useState<"columns" | "rows">("columns");

  return (
    <div className={`space-y-4 rounded-xl border border-border/80 bg-card/40 p-4 sm:p-6 shadow-sm backdrop-blur-sm ${className}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          {title && (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 gap-1">
                <Sparkles className="h-3 w-3" /> Live Dual Theme
              </Badge>
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>

        {/* Layout controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant={layout === "columns" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLayout("columns")}
            className="h-8 px-2.5 text-xs gap-1.5"
            title="Side-by-side columns"
          >
            <Columns2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Side-by-Side</span>
          </Button>
          <Button
            variant={layout === "rows" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLayout("rows")}
            className="h-8 px-2.5 text-xs gap-1.5"
            title="Stacked rows"
          >
            <Rows2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Stacked</span>
          </Button>
        </div>
      </div>

      {/* Dual view containers */}
      <div
        className={`grid gap-4 ${
          layout === "columns" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* LIGHT MODE PANE */}
        <div className="theme-light rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm overflow-hidden flex flex-col transition-all">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/90 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span>Light Theme</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
              .theme-light
            </span>
          </div>
          <div className="p-4 sm:p-6 flex-1 bg-white text-slate-900 overflow-x-auto">
            {children}
          </div>
        </div>

        {/* DARK MODE PANE */}
        <div className="theme-dark dark rounded-lg border border-slate-800 bg-slate-950 text-slate-100 shadow-sm overflow-hidden flex flex-col transition-all">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <Moon className="h-3.5 w-3.5 text-blue-400" />
              <span>Dark Theme</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
              .theme-dark / .dark
            </span>
          </div>
          <div className="p-4 sm:p-6 flex-1 bg-slate-950 text-slate-100 overflow-x-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
