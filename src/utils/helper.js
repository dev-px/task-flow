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

export const projects2Kanban = [
    {
        id: 1,
        title: "Website Redesign",
        description: "Redesign the corporate marketing website for better UX and conversion",
        progress: 72,
        tasksCompleted: 18,
        totalTasks: 25,
        members: ["Alice Johnson", "Michael Chen", "Sophia Patel", "Daniel Kim", "Olivia Brown"],
        updatedAt: "2026-03-14T10:20:00Z",
        tasks: [
            {
                id: "T-101",
                title: "Research competitor websites",
                column: "Todo",
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
                id: "T-102",
                title: "Create new landing page wireframe",
                column: "In Progress",
                priority: "high",
                assignee: "Sophia Patel",
                dueDate: "2026-03-20",
                subtasks: [
                    { id: "ST-4", title: "Header layout design", completed: true },
                    { id: "ST-5", title: "Hero section structure", completed: false },
                    { id: "ST-6", title: "CTA placement testing", completed: false }
                ]
            },
            {
                id: "T-103",
                title: "Implement responsive navbar",
                column: "Review",
                priority: "high",
                assignee: "Michael Chen",
                dueDate: "2026-03-17",
                subtasks: [
                    { id: "ST-7", title: "Mobile dropdown menu", completed: true },
                    { id: "ST-8", title: "Accessibility improvements", completed: true }
                ]
            },
            {
                id: "T-104",
                title: "Optimize hero images",
                column: "Done",
                priority: "low",
                assignee: "Daniel Kim",
                dueDate: "2026-03-10",
                subtasks: [
                    { id: "ST-9", title: "Compress images", completed: true },
                    { id: "ST-10", title: "Implement lazy loading", completed: true }
                ]
            }
        ]
    },

    {
        id: 2,
        title: "Mobile App UI",
        description: "Design UI system for the new mobile fitness application",
        progress: 48,
        tasksCompleted: 11,
        totalTasks: 23,
        members: ["Emma Wilson", "John Carter", "Liam Smith", "Noah Taylor"],
        updatedAt: "2026-03-16T05:40:00Z",
        tasks: [
            {
                id: "T-201",
                title: "Create design system",
                column: "Todo",
                priority: "high",
                assignee: "Emma Wilson",
                dueDate: "2026-03-22",
                subtasks: [
                    { id: "ST-11", title: "Define color palette", completed: false },
                    { id: "ST-12", title: "Typography scale", completed: false },
                    { id: "ST-13", title: "Component naming rules", completed: false }
                ]
            },
            {
                id: "T-202",
                title: "Design onboarding screens",
                column: "In Progress",
                priority: "medium",
                assignee: "John Carter",
                dueDate: "2026-03-19",
                subtasks: [
                    { id: "ST-14", title: "Welcome screen layout", completed: true },
                    { id: "ST-15", title: "Signup flow design", completed: false }
                ]
            },
            {
                id: "T-203",
                title: "Prototype workout tracking UI",
                column: "Review",
                priority: "high",
                assignee: "Liam Smith",
                dueDate: "2026-03-21",
                subtasks: [
                    { id: "ST-16", title: "Workout progress chart", completed: true },
                    { id: "ST-17", title: "Exercise timer UI", completed: true }
                ]
            },
            {
                id: "T-204",
                title: "User testing feedback review",
                column: "Done",
                priority: "low",
                assignee: "Noah Taylor",
                dueDate: "2026-03-12",
                subtasks: [
                    { id: "ST-18", title: "Collect user feedback", completed: true },
                    { id: "ST-19", title: "Summarize usability issues", completed: true }
                ]
            }
        ]
    }
];