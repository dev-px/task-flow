"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/layout/Spinner";
import usePermissions from "@/hooks/usePermissions";
import StatusCards from "@/components/project/StatusCards";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectDetailList from "@/components/project/ProjectDetailList";
import ProjectDetailCards from "@/components/project/ProjectDetailCards";
import AddEditProject from "@/components/project/ProjectPageDialogs/AddEditProject";
import { initialProjectFilters, initialProjectState } from "@/utils/constant";
import { FolderKanban, PlayCircle, CheckCircle2, Archive } from "lucide-react";
import { useGetAllProjectsQuery } from "@/redux/services/projectApi";

export default function ProjectPage() {
  const { hasPermission } = usePermissions();
  const params = useParams();
  const { organizationId } = params;
  const view = useSelector((state) => state.view.projectView);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState(initialProjectFilters);
  const [form, setForm] = useState(initialProjectState);

  // Get all projects
  const {
    data: projectData,
    isLoading: isProjectLoading,
    isError,
  } = useGetAllProjectsQuery(
    { orgId: organizationId, ...filters },
    { skip: !hasPermission("project:read")  || !organizationId },
  );
  const { projects, limit, page, skip } = projectData?.data || {};

  console.log("projectData", projectData);

  const projectNumber = [
    {
      statusTitle: "Total Projects",
      value: projects?.totalAssigned || 0,
      icon: FolderKanban,
    },
    {
      statusTitle: "Active Projects",
      value: projects?.totalFiltered || 0,
      icon: PlayCircle,
    },
    {
      statusTitle: "Completed Projects",
      value: projects?.statusCounts?.completed || 0,
      icon: CheckCircle2,
    },
    {
      statusTitle: "Archived Projects",
      value: projects?.statusCounts?.archived || 0,
      icon: Archive,
    },
  ];

  return (
    <div className="p-3">
      {/* project page header section */}
      <ProjectHeader
        pTitle="Projects"
        pDescription="Manage and organize your team's projects."
        type="create"
        setShowModal={setShowModal}
        handleProjectManipulation={() => setShowModal(true)}
        hasPermission={hasPermission}
      />

      {/* project page filter section */}
      <ProjectFilters
        page="projects"
        filters={filters}
        setFilters={setFilters}
        onClearFilter={() => setFilters(initialProjectFilters)}
      />

      {/* Quick stats of projects */}
      <section className="my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projectNumber.map((project) => (
            <StatusCards
              key={project.statusTitle}
              Icon={project.icon}
              title={project.statusTitle}
              value={project.value}
            />
          ))}
        </div>
      </section>

      {/* All Projects */}
      <div className="my-8">
        {view === "Grid" ? (
          // grid view
          <>
            {!projects && isProjectLoading && (
              <Spinner text="Loading projects..." />
            )}

            {projects && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ProjectDetailCards
                  projects={projects}
                  isLoading={isProjectLoading}
                />
              </div>
            )}
          </>
        ) : (
          // list or table view
          <>
            {!projects && isProjectLoading && (
              <Spinner text="Loading projects..." />
            )}
            <div className="border overflow-x-auto rounded-md">
              <ProjectDetailList
                projects={projects}
                isLoading={isProjectLoading}
              />
            </div>
          </>
        )}
      </div>
      <AddEditProject
        showModal={showModal}
        setShowModal={setShowModal}
        type="create"
        form={form}
        setForm={setForm}
      />
    </div>
  );
}
