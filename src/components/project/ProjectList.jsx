"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectList({ projects }) {
    const router = useRouter();

    return (
        <table className="w-full text-sm border-collapse">
            <thead className="text-left border-b bg-gray-100">
                <tr>
                    <th className="py-3 px-4 font-semibold">Title</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold">Progress</th>
                    <th className="py-3 px-4 font-semibold sm:table-cell hidden">Tasks</th>
                    <th className="py-3 px-4 font-semibold sm:table-cell hidden">Members</th>
                    <th></th>
                </tr>
            </thead>

            <tbody className="divide-y">
                {projects.map((project) => {
                    const { id, title, description, progress, tasksCompleted, totalTasks, members } = project

                    const taskText =
                        totalTasks > 0 ? `${tasksCompleted} of ${totalTasks}` : "No tasks"

                    const membersText =
                        members.slice(0, 3).join(", ") + (members.length > 3 ? " +" : "")

                    return (
                        <tr className="hover:bg-gray-50 transition cursor-pointer" key={project.id}
                            onClick={() => router.push(`/projects/${title.toLowerCase()}`)}>

                            <td className="px-5 py-4 font-medium">
                                <Link href={`/projects/${title}`}>
                                    {title}
                                </Link>
                            </td>

                            <td className="px-5 py-4 text-gray-500 max-w-62.5 truncate">
                                {description}
                            </td>

                            <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded">
                                        <div
                                            className="h-full bg-gray-800 rounded"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">{progress}%</span>
                                </div>
                            </td>

                            <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">
                                {taskText}
                            </td>

                            <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">
                                {membersText}
                            </td>

                            <td className="px-5 py-4 text-gray-400 text-right">
                                <ChevronRight size={18} />
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}