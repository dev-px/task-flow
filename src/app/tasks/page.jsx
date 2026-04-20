"use client";

import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";
import { useSelector } from "react-redux";
import { initialMyTasksFilter } from "@/utils/constant";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ListTodo,
} from "lucide-react";
import { useState } from "react";
import StatusCards from "@/components/project/StatusCards";

export default function myTask() {
  const { tasks } = useSelector((state) => state.board);
  const [filters, setFilters] = useState(initialMyTasksFilter);

  const taskStats = [
    { id: "active", title: "Active", icon: ListTodo, value: 20 },
    { id: "dueToday", title: "Due Today", icon: CalendarDays, value: 5 },
    { id: "overDue", title: "Overdue", icon: AlertTriangle, value: 15 },
    {
      id: "compThisWeek",
      title: "Completed This Week",
      icon: CheckCircle2,
      value: 25,
    },
  ];

  return (
    <div className="p-3">
      {/* My Task Header */}
      <ProjectHeader
        pTitle="Task"
        pDescription="Contains all the task assigned to you"
      />

      {/* myTaskFIlter */}
      <ProjectFilters
        page="myTasks"
        filters={filters}
        setFilters={setFilters}
        onClearFilter={() => setFilters(initialMyTasksFilter)}
      />

      {/* tasks Stats */}
      <section className="my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {taskStats.map((task) => (
            <StatusCards
              key={task.id}
              Icon={task.icon}
              title={task.title}
              value={task.value}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
