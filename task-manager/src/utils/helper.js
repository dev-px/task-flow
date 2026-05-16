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

    columns: {
      todo: {
        id: "todo",
        title: "Todo",
        wipLimit: null,
      },

      "in-progress": {
        id: "in-progress",
        title: "In Progress",
        wipLimit: 4,
      },

      review: {
        id: "review",
        title: "Review",
        wipLimit: 3,
      },

      testing: {
        id: "testing",
        title: "Testing",
        wipLimit: 2,
      },

      done: {
        id: "done",
        title: "Done",
        wipLimit: null,
      },
    },

    // horizontal order of columns on board
    columnOrder: ["todo", "in-progress", "review", "testing", "done"],

    // only sprint tasks appear here
    columnTaskIds: {
      todo: ["T-102"],
      "in-progress": ["T-103"],
      review: ["T-104"],
      testing: [],
      done: [],
    },

    backlogTaskIds: ["T-101", "T-105"],

    tasks: {
      "T-101": {
        id: "T-101",
        title: "Research competitor websites",
        description: "Analyze competitor UI/UX and collect inspiration",
        type: "task",
        status: "todo",

        // board info
        columnId: "todo",
        columnOrder: 1000,

        // sprint info
        sprintId: null, // backlog

        // project info
        epicId: "EPIC-2",
        priority: "medium",
        labels: ["research", "ui"],

        assigneeId: "U-1",
        reporterId: "U-2",

        dueDate: "2026-03-18",
        storyPoints: 3,

        subTasks: [
          {
            id: "ST-1",
            title: "Analyze 5 competitor websites",
            completed: true,
          },
          {
            id: "ST-2",
            title: "Collect UI inspiration",
            completed: false,
          },
        ],

        attachments: [
          {
            id: "ATT-1",
            name: "competitor-notes.pdf",
            url: "/files/competitor-notes.pdf",
          },
        ],

        comments: [
          {
            id: "C-1",
            userId: "U-2",
            text: "Focus more on SaaS dashboards.",
            createdAt: "2026-03-12",
          },
        ],

        activity: [
          {
            id: "A-1",
            action: "Task created",
            userId: "U-2",
            createdAt: "2026-03-10",
          },
        ],

        createdAt: "2026-03-10",
        updatedAt: "2026-03-12",
      },

      "T-102": {
        id: "T-102",
        title: "Create landing page wireframe",
        description: "Prepare homepage wireframe for redesign",
        type: "story",
        status: "todo",

        columnId: "todo",
        columnOrder: 2000,

        sprintId: "SPR-1",

        epicId: "EPIC-2",
        priority: "high",
        labels: ["design", "wireframe"],

        assigneeId: "U-2",
        reporterId: "U-1",

        dueDate: "2026-03-20",
        storyPoints: 5,

        subTasks: [
          {
            id: "ST-3",
            title: "Create desktop wireframe",
            completed: true,
          },
          {
            id: "ST-4",
            title: "Create mobile wireframe",
            completed: false,
          },
        ],

        attachments: [],
        comments: [],
        activity: [],

        createdAt: "2026-03-11",
        updatedAt: "2026-03-13",
      },

      "T-103": {
        id: "T-103",
        title: "Implement responsive navbar",
        description: "Navbar should work across all screen sizes",
        type: "task",
        status: "in-progress",

        columnId: "in-progress",
        columnOrder: 3000,

        sprintId: "SPR-1",

        epicId: "EPIC-2",
        priority: "critical",
        labels: ["frontend", "responsive"],

        assigneeId: "U-3",
        reporterId: "U-1",

        dueDate: "2026-03-17",
        storyPoints: 8,

        subTasks: [
          {
            id: "ST-5",
            title: "Desktop navbar complete",
            completed: true,
          },
          {
            id: "ST-6",
            title: "Tablet responsiveness",
            completed: false,
          },
        ],

        attachments: [],
        comments: [
          {
            id: "C-2",
            userId: "U-1",
            text: "Please make hamburger animation smoother.",
            createdAt: "2026-03-14",
          },
        ],

        activity: [],

        createdAt: "2026-03-09",
        updatedAt: "2026-03-14",
      },

      "T-104": {
        id: "T-104",
        title: "Cross-browser testing",
        description: "Verify layout across Chrome, Firefox, Safari",
        type: "bug",
        status: "review",

        columnId: "review",
        columnOrder: 4000,

        sprintId: "SPR-1",

        epicId: null,
        priority: "medium",
        labels: ["qa", "testing"],

        assigneeId: "U-3",
        reporterId: "U-2",

        dueDate: "2026-03-18",
        storyPoints: 3,

        subTasks: [],
        attachments: [],
        comments: [],
        activity: [],

        createdAt: "2026-03-12",
        updatedAt: "2026-03-15",
      },

      "T-105": {
        id: "T-105",
        title: "Fix login authentication bug",
        description: "Resolve token validation issue during login",
        type: "bug",
        status: "todo",

        columnId: "todo",
        columnOrder: 5000,

        sprintId: null,

        epicId: "EPIC-1",
        priority: "high",
        labels: ["auth", "backend"],

        assigneeId: "U-4",
        reporterId: "U-1",

        dueDate: "2026-03-19",
        storyPoints: 5,

        subTasks: [],
        attachments: [],
        comments: [
          {
            id: "C-3",
            userId: "U-1",
            text: "This is affecting production users.",
            createdAt: "2026-03-13",
          },
        ],

        activity: [],

        createdAt: "2026-03-13",
        updatedAt: "2026-03-13",
      },

      "T-106": {
        id: "T-106",
        title: "Setup notification system",
        description: "Create in-app notification flow for task updates",
        type: "feature",
        status: "done",

        columnId: "done",
        columnOrder: 6000,

        sprintId: "SPR-1",

        epicId: "EPIC-3",
        priority: "low",
        labels: ["notifications", "feature"],

        assigneeId: "U-2",
        reporterId: "U-1",

        dueDate: "2026-03-16",
        storyPoints: 8,

        subTasks: [
          {
            id: "ST-7",
            title: "Create notification schema",
            completed: true,
          },
          {
            id: "ST-8",
            title: "Frontend notification UI",
            completed: true,
          },
        ],

        attachments: [],
        comments: [],
        activity: [],

        createdAt: "2026-03-08",
        updatedAt: "2026-03-16",
      },
    },

    // sprints
    sprints: {
      "SPR-1": {
        id: "SPR-1",
        name: "Sprint 1",
        goal: "Landing page + navbar delivery",
        startDate: "2026-03-15",
        endDate: "2026-03-30",
        status: "active",
        memberCapacity: 5,
        velocityTarget: 6,
        epicId: "EPIC-1",
      },

      "SPR-2": {
        id: "SPR-2",
        name: "Sprint 2",
        goal: "Authentication improvements",
        startDate: "2026-04-01",
        endDate: "2026-04-15",
        status: "planned",
        memberCapacity: 5,
        velocityTarget: 6,
        epicId: "EPIC-2",
      },
    },

    epics: {
      "EPIC-1": {
        id: "EPIC-1",
        title: "Authentication System",
        description: "Login, signup, session handling",
        color: "#4f46e5",
      },

      "EPIC-2": {
        id: "EPIC-2",
        title: "Landing Page Revamp",
        description: "Improve UI and performance",
        color: "#16a34a",
      },
    },
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
