"use client";

import { useState } from "react";
import Link from 'next/link';
import ProjectDetailCards from "@/components/project/ProjectDetailCards";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";
import StatusCards from "@/components/project/StatusCards";
import { FolderKanban, PlayCircle, CheckCircle2, Archive } from "lucide-react";
import ProjectList from "@/components/project/ProjectList";
import { projects } from "@/utils/helper"

export default function ProjectPage() {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        sort: "",
        view: "Grid"
    });

    const projectNumber = [
        { statusTitle: "Total Projects", value: 24, icon: FolderKanban },
        { statusTitle: "Active Projects", value: 12, icon: PlayCircle },
        { statusTitle: "Completed Projects", value: 8, icon: CheckCircle2 },
        { statusTitle: "Archived Projects", value: 4, icon: Archive },
    ];

    const onClearFilter = () => {
        setFilters({
            search: "",
            status: "",
            sort: "",
            view: "Grid"
        })
    };

    return (
        <div className="p-4">
            <ProjectHeader
                pTitle="Projects"
                pDescription="Manage and organize your team's projects."
                pButton="Create Project"
                type="create"
            />
            <ProjectFilters page="projects" filters={filters} setFilters={setFilters} onClearFilter={onClearFilter} />

            {/* Quick stats */}
            <section className="my-8 ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {projectNumber.map((project) => (
                        <StatusCards key={project.statusTitle} Icon={project.icon} title={project.statusTitle} value={project.value} />
                    ))}
                </div>
            </section>

            {/* All Projects */}
            <div className="my-8">
                {filters.view === "Grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {projects.map((project) => (
                            <Link href={`/projects/${project.id}`} key={project.id}>
                                <ProjectDetailCards project={project} />
                            </Link>

                        ))}
                    </div>
                ) : (
                    <div className="border overflow-x-auto rounded-md">
                        <ProjectList projects={projects} />
                    </div>
                )}
            </div>

        </div>
    )
}