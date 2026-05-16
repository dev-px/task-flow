"use client";

import {
  MessageCircle,
  Paperclip,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { priorityConfig } from "@/utils/helper";
import { useRouter } from "next/navigation";
import SubTaskStatus from "./SubTaskStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MyTaskRowCard({ task, projectId }) {
  const router = useRouter();

  const priority = priorityConfig[task?.priority];

  const currDate = new Date();
  const due = new Date(task?.dueDate);
  const diff = Math.ceil((due - currDate) / (1000 * 60 * 60 * 24));

  const comments = task?.comments?.length || 0;
  const attachments = task?.attachments?.length || 0;
  const subtasks = task?.subTasks || [];

  return (
    <div
      onClick={() =>
        router.push(`/projects/${projectId}/taskdetails/${task.id}`)
      }
      className="group w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400 mb-1">{task.id}</p>

          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-6">
            {task.title}
          </h3>
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-medium shrink-0 ${priority?.color}`}
        >
          <priority.icon size={14} />
          <span>{priority?.label}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="rounded-md bg-slate-100 px-2 py-1 capitalize cursor-default">
              {task.status}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Status: {task.status}</p>
          </TooltipContent>
        </Tooltip>

        {task?.epicId && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="rounded-md bg-slate-100 px-2 py-1 cursor-default">
                {task.epicId}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Epic: {task.epicId}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {task?.storyPoints && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="rounded-md bg-slate-100 px-2 py-1 cursor-default">
                {task.storyPoints} SP
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Story Points: {task.storyPoints}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Subtask Progress */}
      <div className="mb-4">
        <SubTaskStatus subtasks={subtasks} />
      </div>

      {/* Footer */}
      <div className="space-y-3 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>{comments}</span>
            </div>

            <div className="flex items-center gap-1">
              <Paperclip size={14} />
              <span>{attachments}</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 font-medium ${
              diff < 0
                ? "text-red-500"
                : diff === 0
                  ? "text-orange-500"
                  : "text-slate-500"
            }`}
          >
            <CalendarDays size={14} />
            {diff < 0
              ? `${Math.abs(diff)}d overdue`
              : diff === 0
                ? "Today"
                : `${diff}d left`}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
              RK
            </div>
            <span className="text-xs text-slate-500">Assigned</span>
          </div>

          <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
        </div>
      </div>
    </div>
  );
}
