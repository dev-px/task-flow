"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { projectsKanban } from "@/utils/helper"
import TaskSection from "@/components/task/TaskSection";

export default function kanBanPage() {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState(null);

    const data = projectsKanban.filter((project) => project.id === parseInt(projectId))[0];

    useEffect(() => {
        if (data) setTasks(data?.columns ? Object.values(data.columns) : null);
    }, [data]);

    return (
        <div>{tasks && tasks.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto p-2 h-[calc(100vh-100px)]">

                {tasks.map((col) => (
                    <TaskSection key={col.id} col={col} />
                ))}

            </div>

        ) : (
            <div className="flex justify-center items-center h-full font-semibold">No Task Available</div>
        )}</div>
    )
}