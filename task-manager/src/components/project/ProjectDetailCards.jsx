"use client";

import Link from "next/link";
import ProgressBar from "./ProgressBar";
import StatusBadge from "../layout/StatusBadge";
import { dateConfig } from "@/utils/helper";
import { useParams } from "next/navigation";

export default function ProjectDetailCards({ projects, isLoading }) {
  const params = useParams();
  const orgName = params?.organizationName;
  const orgId = params?.organizationId;
  const baseUrl = orgName && orgId ? `/organizations/${orgName}/${orgId}` : "";

  return (
    <>
      {projects?.length &&
        projects?.map((project) => {
          const {
            title,
            description,
            progress,
            tasksCompleted,
            totalTasks,
            members,
            updatedAt,
          } = project;
          const date = dateConfig(updatedAt);

          return (
            <Link href={`${baseUrl}/projects/${project._id}`} key={project._id}>
              <div className="rounded-sm h-full border p-4 cursor-pointer relative hover:bg-gray-50 transition">
                <div className="flex flex-col gap-2 mb-5">
                  <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold">{title}</h1>
                    <span className="p-0 m-0 hidden md:block">
                      <StatusBadge status={project?.status} />
                    </span>
                  </div>
                  <p className="text-gray-500 text-base truncate">
                    {description}
                  </p>
                  {/* progress bar */}
                  <div className="my-2 w-full">
                    <div className="flex justify-between flex-1 items-center gap-2 mb-1">
                      <ProgressBar progress={progress || 0} />
                      <p className="text-sm text-gray-500 mt-1 transition-all duration-300">
                        {progress || 0}%
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 sm:block hidden font-normal italic">
                      {project?.totalTasks > 0
                        ? `${project?.tasksCompleted} of ${project?.totalTasks}`
                        : "No tasks available"}
                    </p>
                  </div>
                  <div className="text-gray-500 sm:block hidden">
                    {members?.length} members
                  </div>
                </div>
                <div className="absolute bottom-2 right-3">
                  <p className="text-xs text-gray-500">last updated {date}</p>
                </div>
              </div>
            </Link>
          );
        })}

      {!projects?.length && !isLoading && (
        <div className="text-center mx-auto">No Project Found</div>
      )}
    </>
  );
}
