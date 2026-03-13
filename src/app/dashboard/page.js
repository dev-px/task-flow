import Cards from "@/components/project/Cards"
import Section from "@/components/project/Section"

export default function DashboardPage() {
    const sections = [
        { name: "Project", projects: [{ title: "Project 1", description: "This is Project 1", status: "In Progress" }, { title: "Project 2", description: "This is Project 2", status: "Completed" }, { title: "Project 3", description: "This is Project 3", status: "Completed" }, { title: "Project 4", description: "This is Project 4", status: "Completed" }, { title: "Project 5", description: "This is Project 5", status: "Completed" }, { title: "Project 6", description: "This is Project 6", status: "Completed" }, { title: "Project 7", description: "This is Project 7", status: "Completed" }] },
        { name: "Tasks", projects: [{ title: "Task 1", description: "This is Task 1", status: "In Progress" }, { title: "Task 2", description: "This is Task 2", status: "Completed" }] },
        { name: "Activity", projects: [{ title: "Activity 1", description: "This is Activity 1", status: "In Progress" }, { title: "Activity 2", description: "This is Activity 2", status: "Completed" }] },
    ]
    return (
        <div className="p-4">
            <h1 className="font-bold text-xl">Good Morning, Dev</h1>
            {sections.map((sec) => (
                <Section key={sec.name} title={sec.name}>
                    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                        {sec.projects.map((project) => (
                            <Cards key={project.title} title={project.title} description={project.description} status={project.status} />
                        ))}
                    </div>
                </Section>
            ))}
        </div>
    )
}