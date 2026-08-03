"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import {setProjectView} from "@/redux/slices/viewSlice";

export default function LayoutSetting({ viewOptions }) {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.view.projectView);
  return (
    <div className="flex items-center gap-1 rounded-xl border bg-background shadow-sm">
      {viewOptions?.map((option) => {
        const Icon = option.icon;
        const isActive = view === option.value;

        return (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => dispatch(setProjectView(option.value))}
                className={`flex h-8 w-9 items-center justify-center rounded-lg transition-all ${
                  isActive ? "bg-muted shadow-sm" : "hover:bg-muted/70"
                }`}
              >
                <Icon size={18} />
              </button>
            </TooltipTrigger>

            <TooltipContent side="bottom" className="text-xs">
              <p>{option.value} View</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
