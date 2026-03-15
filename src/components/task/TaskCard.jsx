import {
    TriangleAlert,
    MessageCircle,
    CalendarDays,
    Paperclip,
    CheckSquare
} from "lucide-react";
import ProgressBar from "../project/ProgressBar";

export default function TaskCard() {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer">

            {/* Issue ID + Priority */}
            <div className="mb-1 text-xs flex justify-between items-center">
                <span className="font-semibold text-gray-600">
                    PRT-01
                </span>

                <div className="text-red-500 flex items-center gap-1">
                    <TriangleAlert size={14} />
                    <span className="text-xs font-medium">High</span>
                </div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-800 mb-2 leading-snug text-sm line-clamp-2">
                Fix checkout API payment failure
            </h3>

            {/* Labels */}
            <div className="flex-wrap flex mb-2 gap-2">
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                    bug
                </span>
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                    backend
                </span>
            </div>

            {/* Subtask Progress */}
            <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <CheckSquare size={14} />
                        <span>12 / 20</span>
                    </div>

                    <span>60%</span>
                </div>

                <ProgressBar progress={60} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">

                {/* Left icons */}
                <div className="flex gap-3 items-center">

                    <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>3</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Paperclip size={14} />
                        <span>2</span>
                    </div>

                    <div className="flex items-center gap-1 text-orange-500">
                        <CalendarDays size={14} />
                        <span>3d</span>
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