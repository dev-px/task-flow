import {
  AlertCircle,
  ArrowUpCircle,
  MinusCircle,
  ArrowDownCircle,
  CircleDashed,
} from "lucide-react";

export const projects = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Redesign company marketing website",
    progress: 70,
    tasksCompleted: 12,
    totalTasks: 18,
    members: ["Alice", "Michael", "Sophia", "Alice", "Michael", "Sophia"],
    updatedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Mobile App UI",
    description: "Design UI for new mobile application",
    progress: 45,
    tasksCompleted: 9,
    totalTasks: 20,
    members: ["Emma", "John", "Liam"],
    updatedAt: "5 hours ago",
  },
  {
    id: 3,
    title: "Admin Dashboard",
    description: "Build analytics dashboard for admins",
    progress: 60,
    tasksCompleted: 15,
    totalTasks: 25,
    members: ["Noah", "Olivia", "Lucas"],
    updatedAt: "1 day ago",
  },
  {
    id: 4,
    title: "Marketing Campaign",
    description: "Launch Q4 digital marketing campaign",
    progress: 85,
    tasksCompleted: 17,
    totalTasks: 20,
    members: ["Sophia", "James"],
    updatedAt: "3 days ago",
  },
  {
    id: 5,
    title: "Authentication System",
    description: "Implement login and signup flow",
    progress: 50,
    tasksCompleted: 10,
    totalTasks: 20,
    members: ["William", "Benjamin"],
    updatedAt: "6 hours ago",
  },
  {
    id: 6,
    title: "Notification Service",
    description: "Add email and push notifications",
    progress: 30,
    tasksCompleted: 6,
    totalTasks: 20,
    members: ["Mason", "Ethan"],
    updatedAt: "4 days ago",
  },
  {
    id: 7,
    title: "Performance Optimization",
    description: "Improve page load speed",
    progress: 55,
    tasksCompleted: 11,
    totalTasks: 20,
    members: ["Alexander", "Daniel"],
    updatedAt: "1 week ago",
  },
  {
    id: 8,
    title: "Landing Page",
    description: "Create new product landing page",
    progress: 90,
    tasksCompleted: 18,
    totalTasks: 20,
    members: ["Emily", "Chloe"],
    updatedAt: "2 hours ago",
  },
  {
    id: 9,
    title: "Database Migration",
    description: "Move database to new infrastructure",
    progress: 35,
    tasksCompleted: 7,
    totalTasks: 20,
    members: ["Matthew", "David"],
    updatedAt: "3 days ago",
  },
  {
    id: 10,
    title: "API Integration",
    description: "Integrate third-party APIs",
    progress: 40,
    tasksCompleted: 8,
    totalTasks: 20,
    members: ["Sebastian", "Jack"],
    updatedAt: "9 hours ago",
  },
  {
    id: 11,
    title: "Dark Mode Feature",
    description: "Add dark mode support",
    progress: 65,
    tasksCompleted: 13,
    totalTasks: 20,
    members: ["Ava", "Isabella"],
    updatedAt: "2 days ago",
  },
  {
    id: 12,
    title: "SEO Optimization",
    description: "Improve search engine rankings",
    progress: 75,
    tasksCompleted: 15,
    totalTasks: 20,
    members: ["Mia", "Charlotte"],
    updatedAt: "4 days ago",
  },
  {
    id: 13,
    title: "User Feedback System",
    description: "Allow users to submit feedback",
    progress: 20,
    tasksCompleted: 4,
    totalTasks: 20,
    members: ["Logan", "Jacob"],
    updatedAt: "6 days ago",
  },
  {
    id: 14,
    title: "Payment Gateway",
    description: "Integrate Stripe payments",
    progress: 55,
    tasksCompleted: 11,
    totalTasks: 20,
    members: ["Amelia", "Harper"],
    updatedAt: "1 day ago",
  },
  {
    id: 15,
    title: "Role Management",
    description: "Add roles and permissions",
    progress: 48,
    tasksCompleted: 12,
    totalTasks: 25,
    members: ["Evelyn", "Henry"],
    updatedAt: "3 days ago",
  },
];

export const dummyData = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Redesign company marketing website",
    status: "active",
    visibility: "public",
    priority: "medium",
    logo: "",
    links: [],
    documents: [],

    users: [
      { id: "U-1", name: "Alice Johnson", role: "admin" },
      { id: "U-2", name: "Sophia Patel", role: "member" },
      { id: "U-3", name: "Michael Chen", role: "member" },
      { id: "U-4", name: "Daniel Kim", role: "member" },
      { id: "U-5", name: "Olivia Brown", role: "member" },
    ],

    // 🔹 Columns (normalized)
    columns: {
      todo: { id: "todo", title: "Todo", wipLimit: null },
      "in-progress": { id: "in-progress", title: "In Progress", wipLimit: 4 },
      review: { id: "review", title: "Review", wipLimit: 3 },
      testing: { id: "testing", title: "Testing", wipLimit: 1 },
      done: { id: "done", title: "Done", wipLimit: 2 },
    },

    // 🔹 Column order (horizontal)
    columnOrder: ["todo", "in-progress", "review", "testing", "done"],

    // 🔹 Column → taskIds (UI ordering)
    columnTaskIds: {
      todo: ["T-101", "T-105"],
      "in-progress": ["T-102"],
      review: ["T-103"],
      testing: ["T-104"],
      done: [],
    },

    // 🔹 Tasks (single source of truth)
    tasks: {
      "T-101": {
        id: "T-101",
        title: "Research competitor websites",
        type: "task",
        columnId: "todo",
        columnOrder: 1000,
        priority: "medium",
        assigneeId: "U-1",
        dueDate: "2026-03-18",
      },

      "T-105": {
        id: "T-105",
        title: "Fix login bug",
        type: "bug",
        columnId: "todo",
        columnOrder: 2000,
        priority: "high",
        assigneeId: "U-4",
        dueDate: "2026-03-19",
      },

      "T-102": {
        id: "T-102",
        title: "Create landing page wireframe",
        type: "story",
        columnId: "in-progress",
        columnOrder: 4000,
        priority: "high",
        assigneeId: "U-2",
        dueDate: "2026-03-20",
      },

      "T-103": {
        id: "T-103",
        title: "Implement responsive navbar",
        type: "task",
        columnId: "review",
        columnOrder: 5000,
        priority: "critical",
        assigneeId: "U-3",
        dueDate: "2026-03-17",
      },

      "T-104": {
        id: "T-104",
        title: "Cross-browser testing",
        type: "bug",
        columnId: "testing",
        columnOrder: 6000,
        priority: "medium",
        assigneeId: "U-3",
        dueDate: "2026-03-18",
      },
    },

    sprints: [
      {
        id: "SPR-1",
        name: "Sprint 1",
        goal: "Landing page + navbar",
        startDate: "2026-03-15",
        endDate: "2026-03-30",
        status: "active",
      },
    ],

    epics: [
      {
        id: "EPIC-1",
        title: "Authentication System",
        description: "Login, signup, session handling",
        color: "#4f46e5",
      },
      {
        id: "EPIC-2",
        title: "Landing Page Revamp",
        description: "Improve UI and performance",
        color: "#16a34a",
      },
    ],
  },
  {
    id: 2,
    title: "New Project",
    description: "",
    status: "active",
    visibility: "private",
    priority: "medium",

    logo: "",
    links: [],
    documents: [],
    users: [],

    columns: {
      todo: { id: "todo", title: "Todo" },
      "in-progress": { id: "in-progress", title: "In Progress" },
      done: { id: "done", title: "Done" },
    },

    columnOrder: ["todo", "in-progress", "done"],

    columnTaskIds: {
      todo: [],
      "in-progress": [],
      done: [],
    },

    tasks: {},

    sprints: [],
    epics: [],
  },
];

export const priorityConfig = {
  critical: {
    label: "Critical",
    color: "text-red-700",
    icon: AlertCircle,
  },
  high: {
    label: "High",
    color: "text-red-500",
    icon: ArrowUpCircle,
  },
  medium: {
    label: "Medium",
    color: "text-yellow-500",
    icon: MinusCircle,
  },
  low: {
    label: "Low",
    color: "text-green-600",
    icon: ArrowDownCircle,
  },
  backlog: {
    label: "Backlog",
    color: "text-gray-400",
    icon: CircleDashed,
  },
};
