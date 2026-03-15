import Cards from "@/components/project/Cards";
import Section from "@/components/project/Section";
import StatusCards from "@/components/project/StatusCards";
import { FolderKanban, ListChecks, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
export default function DashboardPage() {
    const sections = [
        { name: "Project", projects: [{ title: "Project 1", description: "This is Project 1", status: "In Progress" }, { title: "Project 2", description: "This is Project 2", status: "Completed" }, { title: "Project 3", description: "This is Project 3", status: "Completed" }, { title: "Project 4", description: "This is Project 4", status: "Completed" }, { title: "Project 5", description: "This is Project 5", status: "Completed" }, { title: "Project 6", description: "This is Project 6", status: "Completed" }, { title: "Project 7", description: "This is Project 7", status: "Completed" }] },
        { name: "Tasks", projects: [{ title: "Task 1", description: "This is Task 1", status: "In Progress" }, { title: "Task 2", description: "This is Task 2", status: "Completed" }] },
        { name: "Activity", projects: [{ title: "Activity 1", description: "This is Activity 1", status: "In Progress" }, { title: "Activity 2", description: "This is Activity 2", status: "Completed" }] },
    ]
    const status = [
        {
            title: "Active Projects", value: 10, icon: FolderKanban,
        },
        {
            title: "Total Tasks", value: 14, icon: ListChecks,
        },
        {
            title: "Pending Tasks", value: 13, icon: Clock,
        },
        {
            title: "Overdue Tasks", value: 2, icon: AlertTriangle,
        }
    ]
    return (
        <div className="p-4">
            <h1 className="font-bold text-xl">Good Morning, Dev</h1>
            <div className="grid lg:grid-cols-4 gap-6 mt-8 md:grid-cols-2 grid-cols-1">
                {status.map((stat) => (
                    <StatusCards key={stat.title} title={stat.title} value={stat.value} Icon={stat.icon} />
                ))}
            </div>

            {/* Projects, Task and Activity */}
            {sections.map((sec) => (
                <Section key={sec.name} title={sec.name}>
                    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                        {sec.projects.map((project) => (
                            <Link href={`/project/${project.title}`} key={project.title}>
                                <Cards title={project.title} description={project.description} status={project.status} />
                            </Link>
                        ))}
                    </div>
                </Section>
            ))}
        </div>
    )
}