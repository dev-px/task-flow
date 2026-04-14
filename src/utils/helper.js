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

export const projectsKanban = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Redesign company marketing website",
    columns: {
      todo: {
        id: "todo",
        title: "Todo",
        order: 1,
        tasks: [
          {
            id: "T-101",
            columnId: "todo",
            order: 1000,
            title: "Research competitor websites",
            priority: "medium",
            assignee: "Alice Johnson",
            dueDate: "2026-03-18",
            subtasks: [
              {
                id: "ST-1",
                title: "Analyze 5 competitor sites",
                completed: true,
              },
              { id: "ST-2", title: "Collect UI inspiration", completed: true },
              {
                id: "ST-3",
                title: "Prepare research summary",
                completed: false,
              },
            ],
          },
          {
            id: "T-107",
            columnId: "todo",
            order: 2000,
            title: "Define content structure",
            priority: "low",
            assignee: "Olivia Brown",
            dueDate: "2026-03-19",
            subtasks: [],
          },
          {
            id: "T-108",
            columnId: "todo",
            order: 3000,
            title: "Gather branding assets",
            priority: "medium",
            assignee: "Daniel Kim",
            dueDate: "2026-03-18",
            subtasks: [],
          },
        ],
      },

      inProgress: {
        id: "inProgress",
        title: "In Progress",
        order: 2,
        tasks: [
          {
            id: "T-102",
            columnId: "inProgress",
            order: 4000,
            title: "Create landing page wireframe",
            priority: "high",
            assignee: "Sophia Patel",
            dueDate: "2026-03-20",
            subtasks: [
              { id: "ST-4", title: "Header layout design", completed: true },
              { id: "ST-5", title: "Hero section structure", completed: false },
            ],
          },
        ],
      },

      review: {
        id: "review",
        title: "Review",
        order: 3,
        tasks: [
          {
            id: "T-103",
            columnId: "review",
            order: 5000,
            title: "Implement responsive navbar",
            priority: "critical",
            assignee: "Michael Chen",
            dueDate: "2026-03-17",
            subtasks: [
              { id: "ST-7", title: "Mobile dropdown menu", completed: true },
              {
                id: "ST-8",
                title: "Accessibility improvements",
                completed: true,
              },
            ],
          },
        ],
      },

      testing: {
        id: "testing",
        title: "Testing",
        order: 4,
        tasks: [
          {
            id: "T-104",
            columnId: "testing",
            order: 6000,
            title: "Cross-browser testing",
            priority: "medium",
            assignee: "Michael Chen",
            dueDate: "2026-03-18",
            subtasks: [],
          },
        ],
      },

      done: {
        id: "done",
        title: "Done",
        order: 5,
        tasks: [
          {
            id: "T-106",
            columnId: "done",
            order: 7000,
            title: "Optimize hero images",
            priority: "low",
            assignee: "Daniel Kim",
            dueDate: "2026-03-10",
            subtasks: [
              { id: "ST-9", title: "Compress images", completed: true },
              { id: "ST-10", title: "Lazy loading", completed: true },
            ],
          },
        ],
      },
    },
    status: "active",
    visibility: "public",
    priority: "medium",
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

    // workflow: {
    //   states: ["todo", "in-progress", "review", "testing", "done"],
    //   transitions: {
    //     todo: ["in-progress"],
    //     "in-progress": ["review"],
    //     review: ["testing"],
    //     testing: ["done"],
    //   },
    // },

    columns: [
      { id: "todo", title: "Todo", order: 1 },
      { id: "in-progress", title: "In Progress", order: 2 },
      { id: "review", title: "Review", order: 3 },
      { id: "testing", title: "Testing", order: 4 },
      { id: "done", title: "Done", order: 5 },
    ],

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

    tasks: [
      {
        id: "T-101",
        title: "Research competitor websites",
        description: "Analyze UI/UX patterns",

        type: "task",
        status: "todo",
        columnId: "todo",

        projectId: 1,
        sprintId: null, // 🔥 BACKLOG
        epicId: "EPIC-2",

        order: 1000,
        columnOrder: 1000,

        priority: "medium",
        labels: ["research"],

        assigneeId: "U-1",
        reporterId: "U-2",

        dueDate: "2026-03-18",
        storyPoints: 3,

        subtasks: [
          { id: "ST-1", title: "Analyze 5 sites", completed: true },
          { id: "ST-2", title: "Collect inspiration", completed: false },
        ],

        attachments: [],
        comments: [
          {
            id: "C-1",
            userId: "U-2",
            message: "Focus on modern SaaS layouts",
            createdAt: "2026-03-12",
          },
        ],

        activity: [
          {
            id: "A-1",
            type: "created",
            userId: "U-2",
            timestamp: "2026-03-10",
          },
        ],

        createdAt: "2026-03-10",
        updatedAt: "2026-03-12",
      },

      {
        id: "T-102",
        title: "Create landing page wireframe",

        type: "story",
        status: "in-progress",
        columnId: "in-progress",

        projectId: 1,
        sprintId: "SPR-1",
        epicId: "EPIC-2",

        order: 2000,
        columnOrder: 4000,

        priority: "high",
        labels: ["design"],

        assigneeId: "U-2",
        reporterId: "U-1",

        dueDate: "2026-03-20",
        storyPoints: 5,

        subtasks: [],
        attachments: [],

        comments: [],
        activity: [],

        createdAt: "2026-03-11",
        updatedAt: "2026-03-13",
      },

      {
        id: "T-103",
        title: "Implement responsive navbar",

        type: "task",
        status: "review",
        columnId: "review",

        projectId: 1,
        sprintId: "SPR-1",
        epicId: "EPIC-2",

        order: 3000,
        columnOrder: 5000,

        priority: "critical",
        labels: ["frontend"],

        assigneeId: "U-3",
        reporterId: "U-1",

        dueDate: "2026-03-17",
        storyPoints: 8,

        subtasks: [],
        attachments: [],

        comments: [],
        activity: [],

        createdAt: "2026-03-09",
        updatedAt: "2026-03-14",
      },

      {
        id: "T-104",
        title: "Cross-browser testing",

        type: "bug",
        status: "testing",
        columnId: "testing",

        projectId: 1,
        sprintId: "SPR-1",
        epicId: null,

        order: 4000,
        columnOrder: 6000,

        priority: "medium",
        labels: ["qa"],

        assigneeId: "U-3",
        reporterId: "U-2",

        dueDate: "2026-03-18",
        storyPoints: 3,

        subtasks: [],
        attachments: [],

        comments: [],
        activity: [],

        createdAt: "2026-03-12",
        updatedAt: "2026-03-15",
      },

      {
        id: "T-105",
        title: "Fix login bug",

        type: "bug",
        status: "todo",
        columnId: "todo",

        projectId: 1,
        sprintId: null, // 🔥 BACKLOG
        epicId: "EPIC-1",

        order: 5000,
        columnOrder: 2000,

        priority: "high",
        labels: ["auth"],

        assigneeId: "U-4",
        reporterId: "U-1",

        dueDate: "2026-03-19",
        storyPoints: 5,

        subtasks: [],
        attachments: [],

        comments: [],
        activity: [],

        createdAt: "2026-03-13",
        updatedAt: "2026-03-13",
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

    // workflow: {
    //   states: ["todo"],
    //   transitions: {
    //     todo: [],
    //   },
    // },

    columns: [
      { id: "todo", title: "Todo", order: 1000 },
      { id: "in-progress", title: "In Progress", order: 2000 },
      { id: "done", title: "Done", order: 3000 },
    ],

    sprints: [],

    epics: [],

    tasks: [],
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
