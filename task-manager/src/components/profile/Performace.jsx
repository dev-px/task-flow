import { useMemo, useState } from "react";
import {
  Briefcase,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Target,
  Users,
  BarChart3,
} from "lucide-react";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/Card";
import ProgressBar from "../project/ProgressBar";
import SectionCard from "../layout/SectionCard";

/*
Assumptions:
- SectionCard component already exists
- Field component already exists (not used here intentionally)
- shadcn/ui is configured

Performance tab should be analytics-driven, not input-based.
This is a role-based SaaS dashboard for Employee / Manager / Admin.
*/

const performanceConfig = {
  employee: {
    title: "My Performance",
    description:
      "Track your productivity, delivery consistency, and work insights.",
    metrics: [
      "tasksCompleted",
      "activeProjects",
      "pendingTasks",
      "overdueTasks",
      "productivityScore",
      "deadlineSuccessRate",
      "weeklyPerformance",
      "monthlyPerformance",
      "sprintVelocity",
      "averageTaskCompletionTime",
      "taskCompletionRate",
    ],
  },
  manager: {
    title: "Team Performance",
    description:
      "Monitor team productivity, delivery health, and contribution insights.",
    metrics: [
      "tasksCompleted",
      "activeProjects",
      "pendingTasks",
      "overdueTasks",
      "productivityScore",
      "deadlineSuccessRate",
      "weeklyPerformance",
      "monthlyPerformance",
      "sprintVelocity",
      "averageTaskCompletionTime",
      "taskCompletionRate",
      "teamContributionScore",
      "projectParticipation",
    ],
  },
  admin: {
    title: "Organization Performance",
    description:
      "Organization-wide performance analytics and operational productivity insights.",
    metrics: [
      "tasksCompleted",
      "activeProjects",
      "pendingTasks",
      "overdueTasks",
      "productivityScore",
      "deadlineSuccessRate",
      "weeklyPerformance",
      "monthlyPerformance",
      "sprintVelocity",
      "averageTaskCompletionTime",
      "taskCompletionRate",
      "teamContributionScore",
      "projectParticipation",
    ],
  },
};

const metricMap = {
  tasksCompleted: {
    label: "Tasks Completed",
    value: 128,
    suffix: " tasks",
    progress: 88,
    icon: CheckCircle2,
  },
  activeProjects: {
    label: "Active Projects",
    value: 6,
    suffix: " running",
    progress: 72,
    icon: Briefcase,
  },
  pendingTasks: {
    label: "Pending Tasks",
    value: 14,
    suffix: " pending",
    progress: 40,
    icon: Clock3,
  },
  overdueTasks: {
    label: "Overdue Tasks",
    value: 3,
    suffix: " overdue",
    progress: 20,
    icon: AlertTriangle,
  },
  productivityScore: {
    label: "Productivity Score",
    value: 87,
    suffix: "%",
    progress: 87,
    icon: TrendingUp,
  },
  deadlineSuccessRate: {
    label: "Deadline Success Rate",
    value: 94,
    suffix: "%",
    progress: 94,
    icon: Target,
  },
  weeklyPerformance: {
    label: "Weekly Performance",
    value: 82,
    suffix: "%",
    progress: 82,
    icon: BarChart3,
  },
  monthlyPerformance: {
    label: "Monthly Performance",
    value: 89,
    suffix: "%",
    progress: 89,
    icon: BarChart3,
  },
  sprintVelocity: {
    label: "Sprint Velocity",
    value: 91,
    suffix: "%",
    progress: 91,
    icon: TrendingUp,
  },
  averageTaskCompletionTime: {
    label: "Avg Task Completion",
    value: 2.4,
    suffix: " days",
    progress: 76,
    icon: Clock3,
  },
  taskCompletionRate: {
    label: "Task Completion Rate",
    value: 93,
    suffix: "%",
    progress: 93,
    icon: CheckCircle2,
  },
  teamContributionScore: {
    label: "Team Contribution",
    value: 84,
    suffix: "%",
    progress: 84,
    icon: Users,
  },
  projectParticipation: {
    label: "Project Participation",
    value: 9,
    suffix: " projects",
    progress: 78,
    icon: Briefcase,
  },
};

function MetricCard({ item }) {
  const Icon = item.icon;

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <h3 className="text-2xl font-bold mt-1">
              {item.value}
              <span className="text-base font-medium">{item.suffix}</span>
            </h3>
          </div>

          <div className="rounded-xl border p-2">
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <ProgressBar value={item.progress} className="h-2" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Performance</span>
          <Badge variant="outline">{item.progress}%</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function ManagerReviewTable() {
  const members = [
    { name: "John Carter", tasks: 45, score: 89, status: "Excellent" },
    { name: "Alex Roy", tasks: 32, score: 74, status: "Good" },
    { name: "Emma Stone", tasks: 27, score: 68, status: "Average" },
  ];

  return (
    <div className="rounded-2xl border p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Manager Review</h3>
        <p className="text-sm text-muted-foreground">
          Team productivity and contribution overview
        </p>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.name}
            className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">
                {member.tasks} tasks completed
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge>{member.score}% Score</Badge>
              <Badge variant="outline">{member.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PerformanceTab() {
  const [role, setRole] = useState("employee");

  const currentConfig = performanceConfig[role];

  const visibleMetrics = useMemo(() => {
    return currentConfig.metrics.map((key) => ({
      key,
      ...metricMap[key],
    }));
  }, [currentConfig]);

  return (
    <SectionCard
      title={currentConfig.title}
      description={currentConfig.description}
      icon={TrendingUp}
    >
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          {Object.keys(performanceConfig).map((item) => (
            <Button
              key={item}
              variant={role === item ? "default" : "outline"}
              onClick={() => setRole(item)}
              className="capitalize"
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleMetrics.map((item) => (
            <MetricCard key={item.key} item={item} />
          ))}
        </div>

        {(role === "manager" || role === "admin") && <ManagerReviewTable />}
      </div>
    </SectionCard>
  );
}
