import {
    TriangleAlert, MessageCircle, CalendarDays,
    Paperclip, CheckSquare, ListX,
    
} from "lucide-react";
import ProgressBar from "../project/ProgressBar";
import { priorityConfig } from "@/utils/helper";

export default function TaskCard({ task }) {
    const currDate = new Date();
    const updateDate = new Date(task?.dueDate);
    const timeDiff = updateDate - currDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const completeSTaskLength = task.subtasks.filter(st => st.completed).length;
    const priority = priorityConfig[task?.priority];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer">

            {/* Issue ID + Priority */}
            <div className="mb-1 text-xs flex justify-between items-center">
                <span className="font-semibold text-gray-600">
                    {task?.id}
                </span>

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
                {task.subtasks && task.subtasks.length > 0 ? (
                    <>
                        <div className="text-xs text-gray-500 mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <CheckSquare size={14} />
                                <span>{completeSTaskLength}{" "}/ {task.subtasks.length}</span>
                            </div>

                            <span>{Math.round((completeSTaskLength / task.subtasks.length) * 100)} %</span>
                        </div>

                        <ProgressBar progress={(completeSTaskLength / task.subtasks.length) * 100} />
                    </>
                ) : (
                    // when no subtasks
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                        <ListX size={14} />
                        <span>No subtasks</span>
                    </div>
                )}
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
                    <div className={`flex items-center gap-1 ${daysLeft < 0 ? "text-red-500" : "text-orange-500"}`}>
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
    );
}