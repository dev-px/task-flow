"use client";

import { useState } from "react";
import ProjectDetailCards from "@/components/project/ProjectDetailCards";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";
import StatusCards from "@/components/project/StatusCards";
import { FolderKanban, PlayCircle, CheckCircle2, Archive } from "lucide-react";
import { projects } from "@/utils/helper";
import AddEditProject from "@/components/project/ProjectPageDialogs/AddEditProject";
import ProjectDetailList from "@/components/project/ProjectDetailList";
import { initialProjectFilters, initialProjectState } from "@/utils/constant";

export default function ProjectPage() {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState(initialProjectFilters);
  // for add project modal
  const [form, setForm] = useState(initialProjectState);

  const projectNumber = [
    { statusTitle: "Total Projects", value: 24, icon: FolderKanban },
    { statusTitle: "Active Projects", value: 12, icon: PlayCircle },
    { statusTitle: "Completed Projects", value: 8, icon: CheckCircle2 },
    { statusTitle: "Archived Projects", value: 4, icon: Archive },
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
        {filters.view === "Grid" ? (
          // grid view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProjectDetailCards projects={projects} />
          </div>
        ) : (
          // list or table view
          <div className="border overflow-x-auto rounded-md">
            <ProjectDetailList projects={projects} />
          </div>
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
