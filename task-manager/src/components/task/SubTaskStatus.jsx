import { CheckSquare, ListX } from "lucide-react";
import ProgressBar from "./../project/ProgressBar";

export default function SubTaskStatus({ subtasks }) {
  const completeSTaskLength = subtasks.filter((st) => st.completed).length;
  const totalSubTasks = subtasks.length;
  return (
    <>
      {subtasks && totalSubTasks > 0 ? (
        <>
          <div className="text-xs text-gray-500 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <CheckSquare size={14} />
              <span>
                {completeSTaskLength} / {totalSubTasks} completed
              </span>
            </div>

            <span>
              {Math.round((completeSTaskLength / totalSubTasks) * 100)} %
            </span>
          </div>

          <ProgressBar progress={(completeSTaskLength / totalSubTasks) * 100} />
        </>
      ) : (
        // when no subtasks
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <ListX size={14} />
          <span>No subtasks</span>
        </div>
      )}
    </>
  );
}
