import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";

export default function ProjectPage() {
    return (
        <div className="p-4">
            <ProjectHeader
                pTitle="Projects"
                pDescription="Manage and organize your team's projects."
                pButton="Create Project"
                type="create"
            />
            <ProjectFilters />

        </div>
    )
}