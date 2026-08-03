"use client";

import Link from "next/link";
import Spinner from "../layout/Spinner";
import { ChevronRight } from "lucide-react";
import usePermissions from "@/hooks/usePermissions";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDetailList({ projects, isLoading }) {
  const router = useRouter();
  const params = useParams();
  const { hasPermission } = usePermissions();
  const orgName = params?.organizationName;
  const orgId = params?.organizationId;
  const baseUrl = orgName && orgId ? `/organizations/${orgName}/${orgId}` : "";

  return (
    <table className="w-full text-sm border-collapse">
      <thead className="text-left border-b bg-gray-100">
        <tr>
          <th className="py-3 px-4 font-semibold">Title</th>
          <th className="py-3 px-4 font-semibold">Description</th>
          <th className="py-3 px-4 font-semibold">Progress</th>
          <th className="py-3 px-4 font-semibold sm:table-cell hidden">
            Tasks
          </th>
          <th className="py-3 px-4 font-semibold sm:table-cell hidden">
            Members
          </th>
          <th></th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {!projects && isLoading && <Spinner text="Loading projects..." />}

        {projects?.length > 0 &&
          projects?.map((project) => {
            const {
              id,
              title,
              description,
              progress,
              tasksCompleted,
              totalTasks,
              members,
            } = project;

            const taskText =
              totalTasks > 0
                ? `${tasksCompleted} of ${totalTasks}`
                : "No tasks";

            const membersText = members
              ? members?.slice(0, 3).join(", ") +
                (members?.length > 3 ? " +" : "")
              : "";

            return (
              <tr
                className="hover:bg-gray-50 transition cursor-pointer"
                key={project._id}
                onClick={() =>
                  router.push(`${baseUrl}/projects/${project._id}`)
                }
              >
                <td className="px-5 py-4 font-medium">
                  <Link href={`${baseUrl}/projects/${project._id}`}>
                    {title}
                  </Link>
                </td>

                <td className="px-5 py-4 text-gray-500 max-w-62.5 truncate">
                  {description}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded">
                      <div
                        className="h-full bg-gray-800 rounded"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{progress}%</span>
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">
                  {taskText}
                </td>

                <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">
                  {membersText}
                </td>

                <td className="px-5 py-4 text-gray-400 text-right">
                  <ChevronRight size={18} />
                </td>
              </tr>
            );
          })}

        {projects?.length <= 0 && !isLoading && (
          <tr className="text-center">
            <td colSpan="6" className="py-4">
              No Project Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
