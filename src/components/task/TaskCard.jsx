import {
  MessageCircle,
  CalendarDays,
  Paperclip
} from "lucide-react";
import { priorityConfig } from "@/utils/helper";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SubTaskStatus from "./SubTaskStatus";

export default function TaskCard({
  task,
  index,
  setClickedTaskId,
  setOpenTaskDialog,
}) {
  const currDate = new Date();
  const updateDate = new Date(task?.dueDate);
  const timeDiff = updateDate - currDate;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const priority = priorityConfig[task?.priority];

  const {
    setNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      columnId: task.columnId,
      index,
    },
  });

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer touch-none select-none"
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
        }}
        onClick={() => {
          setClickedTaskId(task.id);
          setOpenTaskDialog(true);
        }}
      >
        {/* Issue ID + Priority */}
        <div className="mb-1 text-xs flex justify-between items-center">
          <span className="font-semibold text-gray-600">{task?.id}</span>

          <div className={`flex items-center gap-1 ${priority?.color}`}>
            <priority.icon size={14} />
            <span className="text-xs font-medium">{priority?.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-800 mb-2 leading-snug text-sm line-clamp-2">
          {task?.title}
        </h3>

        {/* Labels */}
        {/* <div className="flex-wrap flex mb-2 gap-2">
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                    bug
                </span>
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                    backend
                </span>
            </div> */}

        {/* Subtask Progress */}
        <div className="mb-3">
          <SubTaskStatus subtasks={task?.subtasks || []} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-3 items-center">
            {/* Comments */}
            <div className="flex items-center gap-1 text-gray-500">
              <MessageCircle size={14} />
              <span>3</span>
            </div>

            {/* Attachments */}
            <div className="flex items-center gap-1 text-gray-500">
              <Paperclip size={14} />
              <span>2</span>
            </div>

            {/* Due Date */}
            <div
              className={`flex items-center gap-1 ${daysLeft < 0 ? "text-red-500" : "text-orange-500"}`}
            >
              <CalendarDays size={14} />
              {daysLeft < 0 ? (
                <span>{Math.abs(daysLeft)}d overdue</span>
              ) : daysLeft == 0 ? (
                <span>Due today</span>
              ) : (
                <span>{daysLeft}d left</span>
              )}
            </div>
          </div>

          {/* Assignee */}
          <div className="w-7 h-7 rounded-full bg-gray-300 flex justify-center text-xs font-medium items-center">
            RK
          </div>
        </div>
      </div>
    </>
  );
}
