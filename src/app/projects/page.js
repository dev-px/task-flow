"use client";

import { useState } from "react";
import Link from 'next/link';
import ProjectDetailCards from "@/components/project/ProjectDetailCards";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";
import StatusCards from "@/components/project/StatusCards";
import { FolderKanban, PlayCircle, CheckCircle2, Archive } from "lucide-react";
import ProjectList from "@/components/project/ProjectList";

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

    // dummy data
    const projects = [
        {
            id: 1,
            title: "Website Redesign",
            description: "Redesign company marketing website",
            progress: 70,
            tasksCompleted: 12,
            totalTasks: 18,
            members: ["Alice", "Michael", "Sophia", "Alice", "Michael", "Sophia"],
            updatedAt: "2 days ago"
        },
        {
            id: 2,
            title: "Mobile App UI",
            description: "Design UI for new mobile application",
            progress: 45,
            tasksCompleted: 9,
            totalTasks: 20,
            members: ["Emma", "John", "Liam"],
            updatedAt: "5 hours ago"
        },
        {
            id: 3,
            title: "Admin Dashboard",
            description: "Build analytics dashboard for admins",
            progress: 60,
            tasksCompleted: 15,
            totalTasks: 25,
            members: ["Noah", "Olivia", "Lucas"],
            updatedAt: "1 day ago"
        },
        {
            id: 4,
            title: "Marketing Campaign",
            description: "Launch Q4 digital marketing campaign",
            progress: 85,
            tasksCompleted: 17,
            totalTasks: 20,
            members: ["Sophia", "James"],
            updatedAt: "3 days ago"
        },
        {
            id: 5,
            title: "Authentication System",
            description: "Implement login and signup flow",
            progress: 50,
            tasksCompleted: 10,
            totalTasks: 20,
            members: ["William", "Benjamin"],
            updatedAt: "6 hours ago"
        },
        {
            id: 6,
            title: "Notification Service",
            description: "Add email and push notifications",
            progress: 30,
            tasksCompleted: 6,
            totalTasks: 20,
            members: ["Mason", "Ethan"],
            updatedAt: "4 days ago"
        },
        {
            id: 7,
            title: "Performance Optimization",
            description: "Improve page load speed",
            progress: 55,
            tasksCompleted: 11,
            totalTasks: 20,
            members: ["Alexander", "Daniel"],
            updatedAt: "1 week ago"
        },
        {
            id: 8,
            title: "Landing Page",
            description: "Create new product landing page",
            progress: 90,
            tasksCompleted: 18,
            totalTasks: 20,
            members: ["Emily", "Chloe"],
            updatedAt: "2 hours ago"
        },
        {
            id: 9,
            title: "Database Migration",
            description: "Move database to new infrastructure",
            progress: 35,
            tasksCompleted: 7,
            totalTasks: 20,
            members: ["Matthew", "David"],
            updatedAt: "3 days ago"
        },
        {
            id: 10,
            title: "API Integration",
            description: "Integrate third-party APIs",
            progress: 40,
            tasksCompleted: 8,
            totalTasks: 20,
            members: ["Sebastian", "Jack"],
            updatedAt: "9 hours ago"
        },
        {
            id: 11,
            title: "Dark Mode Feature",
            description: "Add dark mode support",
            progress: 65,
            tasksCompleted: 13,
            totalTasks: 20,
            members: ["Ava", "Isabella"],
            updatedAt: "2 days ago"
        },
        {
            id: 12,
            title: "SEO Optimization",
            description: "Improve search engine rankings",
            progress: 75,
            tasksCompleted: 15,
            totalTasks: 20,
            members: ["Mia", "Charlotte"],
            updatedAt: "4 days ago"
        },
        {
            id: 13,
            title: "User Feedback System",
            description: "Allow users to submit feedback",
            progress: 20,
            tasksCompleted: 4,
            totalTasks: 20,
            members: ["Logan", "Jacob"],
            updatedAt: "6 days ago"
        },
        {
            id: 14,
            title: "Payment Gateway",
            description: "Integrate Stripe payments",
            progress: 55,
            tasksCompleted: 11,
            totalTasks: 20,
            members: ["Amelia", "Harper"],
            updatedAt: "1 day ago"
        },
        {
            id: 15,
            title: "Role Management",
            description: "Add roles and permissions",
            progress: 48,
            tasksCompleted: 12,
            totalTasks: 25,
            members: ["Evelyn", "Henry"],
            updatedAt: "3 days ago"
        }
    ];

    return (
        <div className="p-4">
            <ProjectHeader
                pTitle="Projects"
                pDescription="Manage and organize your team's projects."
                pButton="Create Project"
                type="create"
            />
            <ProjectFilters filters={filters} setFilters={setFilters} />

            {/* Quick stats */}
            <section className="my-8 ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {projectNumber.map((project) => (
                        <Link href={`/projects/${project.statusTitle.toLowerCase()}`} key={project.statusTitle}>
                            <StatusCards Icon={project.icon} title={project.statusTitle} value={project.value} />
                        </Link>
                    ))}
                </div>
            </section>

            {/* All Projects */}
            <div className="my-8">
                {filters.view === "Grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {projects.map((project) => (
                            <ProjectDetailCards key={project.id} project={project} />
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