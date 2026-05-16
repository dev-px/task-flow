"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LayoutSetting({ viewOptions, updateFilters, filters }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border bg-background shadow-sm">
      {viewOptions.map((option) => {
        const Icon = option.icon;
        const isActive = filters.view === option.value;

        return (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => updateFilters("view", option.value)}
                className={`flex h-8 w-9 items-center justify-center rounded-lg transition-all ${
                  isActive ? "bg-muted shadow-sm" : "hover:bg-muted/70"
                }`}
              >
                <Icon size={18} />
              </button>
            </TooltipTrigger>

            <TooltipContent side="bottom" className="text-xs" side="top">
              <p>{option.value} View</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
