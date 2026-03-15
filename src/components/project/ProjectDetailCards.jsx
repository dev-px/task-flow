import ProgressBar from "./ProgressBar";

export default function ProjectDetailCards({ project }) {
    const { title, description, progress, tasksCompleted, totalTasks, members, updatedAt } = project;

    return (
        <div className="rounded-sm h-full border p-4 cursor-pointer relative hover:bg-gray-50 transition">
            <div className="flex flex-col gap-2 mb-5">
                <h1 className="text-lg font-bold">{title}</h1>
                <p className="text-gray-500 text-base truncate">{description}</p>
                {/* progress bar */}
                <div className="my-2 w-full">
                    <div className="flex justify-between flex-1 items-center gap-2 mb-1">
                        <ProgressBar progress={progress} />
                        <p className="text-sm text-gray-500 mt-1 transition-all duration-300">{progress}%</p>
                    </div>
                    <p className="text-sm text-gray-500 sm:block hidden">{project.totalTasks > 0 ? `${project.tasksCompleted} of ${project.totalTasks}` : "No tasks"}</p>
                </div>
                <div className="text-gray-500 sm:block hidden">{members.length} members</div>
            </div>
            <div className="absolute bottom-2 right-3">
                <p className="text-xs text-gray-500">{updatedAt}</p>
            </div>
        </div >
    )
}