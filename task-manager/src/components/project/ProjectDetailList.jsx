"use client";

import Link from "next/link";
import ProgressBar from "./ProgressBar";
import StatusBadge from "../layout/StatusBadge";
import usePermissions from "@/hooks/usePermissions";
import { dateConfig } from "@/utils/helper";
import { ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDetailList({ projects, isLoading }) {
  const router = useRouter();
  const params = useParams();
  const { hasPermission } = usePermissions();
  const orgName = params?.organizationName;
  const orgId = params?.organizationId;
  const baseUrl = orgName && orgId ? `/organizations/${orgName}/${orgId}` : "";

  const date = dateConfig(projects?.updatedAt);

  return (
    <table className="w-full text-sm border-collapse">
      <thead className="text-left border-b bg-gray-100">
        <tr>
          <th className="py-3 px-4 font-semibold">Title</th>
          <th className="py-3 px-4 font-semibold">Description</th>
          <th className="py-3 px-4 font-semibold">Progress</th>
          <th className="py-3 px-4 font-semibold">Status</th>
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

        {projects?.length > 0 &&
          projects?.map((project) => {
            const {
              id,
              title,
              description,
              progress,
              status,
              tasksCompleted,
              totalTasks,
              members,
            } = project;

            const taskText =
              totalTasks > 0
                ? `${tasksCompleted} of ${totalTasks}`
                : "No tasks available";

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
                    <ProgressBar progress={progress || 0} />
                      <p className="text-sm text-gray-500 mt-1 transition-all duration-300">
                        {progress || 0}%
                      </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={status} />
                </td>

                <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">
                  {taskText}
                </td>

                <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">
                  {membersText} members
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
