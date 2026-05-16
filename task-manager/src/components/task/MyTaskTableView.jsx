"use client";

import { useRouter } from "next/navigation";
import { priorityConfig } from "@/utils/helper";
import SubTaskStatus from "./SubTaskStatus";

export default function MyTaskTableView({ tasks, projectId }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Subtask Progress</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Assignee</th>
            </tr>
          </thead>

          <tbody>
            {Object.values(tasks)?.map((task) => {
              const priority = priorityConfig[task?.priority];

              return (
                <tr
                  key={task.id}
                  onClick={() =>
                    router.push(`/projects/${projectId}/taskdetails/${task.id}`)
                  }
                  className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.id}</p>
                    </div>
                  </td>

                  <td className="px-4 py-3 capitalize">{task.status}</td>

                  <td className="px-4 py-3">
                    <div
                      className={`flex items-center gap-1 ${priority?.color}`}
                    >
                      <priority.icon size={14} />
                      <span>{priority?.label}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 w-52">
                    <div className="">
                      <SubTaskStatus subtasks={task?.subTasks || []} />
                    </div>
                  </td>

                  <td className="px-4 py-3">{task.dueDate}</td>

                  <td className="px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold">
                      RK
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
