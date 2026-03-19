import {AlertCircle, ArrowUpCircle, MinusCircle,
    ArrowDownCircle, CircleDashed} from "lucide-react"

export const projects = [
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

export const projectsKanban = [
    {
        id: 1,
        title: "Website Redesign",
        columns: {
            todo: {
                id: "todo",
                title: "Todo",
                tasks: [
                    {
                        id: "T-101",
                        title: "Research competitor websites",
                        priority: "medium",
                        assignee: "Alice Johnson",
                        dueDate: "2026-03-18",
                        subtasks: [
                            { id: "ST-1", title: "Analyze 5 competitor sites", completed: true },
                            { id: "ST-2", title: "Collect UI inspiration", completed: true },
                            { id: "ST-3", title: "Prepare research summary", completed: false }
                        ]
                    },
                    {
                        id: "T-107",
                        title: "Define content structure",
                        priority: "low",
                        assignee: "Olivia Brown",
                        dueDate: "2026-03-19",
                        subtasks: []
                    },
                    {
                        id: "T-108",
                        title: "Gather branding assets",
                        priority: "medium",
                        assignee: "Daniel Kim",
                        dueDate: "2026-03-18",
                        subtasks: []
                    }
                ]
            },

            inProgress: {
                id: "inProgress",
                title: "In Progress",
                tasks: [
                    {
                        id: "T-102",
                        title: "Create landing page wireframe",
                        priority: "high",
                        assignee: "Sophia Patel",
                        dueDate: "2026-03-20",
                        subtasks: [
                            { id: "ST-4", title: "Header layout design", completed: true },
                            { id: "ST-5", title: "Hero section structure", completed: false }
                        ]
                    }
                ]
            },

            review: {
                id: "review",
                title: "Review",
                tasks: [
                    {
                        id: "T-103",
                        title: "Implement responsive navbar",
                        priority: "critical",
                        assignee: "Michael Chen",
                        dueDate: "2026-03-17",
                        subtasks: [
                            { id: "ST-7", title: "Mobile dropdown menu", completed: true },
                            { id: "ST-8", title: "Accessibility improvements", completed: true }
                        ]
                    }
                ]
            },

            testing: {
                id: "testing",
                title: "Testing",
                tasks: [
                    {
                        id: "T-104",
                        title: "Cross-browser testing",
                        priority: "medium",
                        assignee: "Michael Chen",
                        dueDate: "2026-03-18",
                        subtasks: []
                    }
                ]
            },

            done: {
                id: "done",
                title: "Done",
                tasks: [
                    {
                        id: "T-106",
                        title: "Optimize hero images",
                        priority: "low",
                        assignee: "Daniel Kim",
                        dueDate: "2026-03-10",
                        subtasks: [
                            { id: "ST-9", title: "Compress images", completed: true },
                            { id: "ST-10", title: "Lazy loading", completed: true }
                        ]
                    }
                ]
            }
        }
    }
];

export const priorityConfig = {
    critical: {
        label: "Critical",
        color: "text-red-700",
        icon: AlertCircle
    },
    high: {
        label: "High",
        color: "text-red-500",
        icon: ArrowUpCircle
    },
    medium: {
        label: "Medium",
        color: "text-yellow-500",
        icon: MinusCircle
    },
    low: {
        label: "Low",
        color: "text-green-600",
        icon: ArrowDownCircle
    },
    backlog: {
        label: "Backlog",
        color: "text-gray-400",
        icon: CircleDashed
    }
};