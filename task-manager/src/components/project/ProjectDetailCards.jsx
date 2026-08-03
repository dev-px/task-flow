"use client";

import Link from "next/link";
import ProgressBar from "./ProgressBar";
import { useParams } from "next/navigation";
import Spinner from "../layout/Spinner";

export default function ProjectDetailCards({ projects, isLoading }) {
  const params = useParams();
  const orgName = params?.organizationName;
  const orgId = params?.organizationId;
  const baseUrl = orgName && orgId ? `/organizations/${orgName}/${orgId}` : "";
  return (
    <>
      {!projects && isLoading && <Spinner text="Loading projects..." />}

      {  projects?.length > 0 &&
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
          return (
            <Link href={`${baseUrl}/projects/${project.id}`} key={project._id}>
              <div className="rounded-sm h-full border p-4 cursor-pointer relative hover:bg-gray-50 transition">
                <div className="flex flex-col gap-2 mb-5">
                  <h1 className="text-lg font-bold">{title}</h1>
                  <p className="text-gray-500 text-base truncate">
                    {description}
                  </p>
                  {/* progress bar */}
                  <div className="my-2 w-full">
                    <div className="flex justify-between flex-1 items-center gap-2 mb-1">
                      <ProgressBar progress={progress} />
                      <p className="text-sm text-gray-500 mt-1 transition-all duration-300">
                        {progress}%
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 sm:block hidden">
                      {project.totalTasks > 0
                        ? `${project.tasksCompleted} of ${project.totalTasks}`
                        : "No tasks"}
                    </p>
                  </div>
                  <div className="text-gray-500 sm:block hidden">
                    {members?.length} members
                  </div>
                </div>
                <div className="absolute bottom-2 right-3">
                  <p className="text-xs text-gray-500">{updatedAt}</p>
                </div>
              </div>
            </Link>
          );
        })}

      {projects?.length <= 0 && !isLoading && (
        <div className="text-center mx-auto">No Project Found</div>
      )}
    </>
  );
}
