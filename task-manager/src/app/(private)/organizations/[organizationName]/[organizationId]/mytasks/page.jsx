"use client";

import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";
import { initialMyTasksFilter } from "@/utils/constant";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ListTodo,
} from "lucide-react";
import { useEffect, useState } from "react";
import StatusCards from "@/components/project/StatusCards";
import { dummyData } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import MyTaskRowCard from "@/components/task/MyTaskRowCard";
import { setBoard } from "@/redux/slices/boardSlice";
import MyTaskTableView from "@/components/task/MyTaskTableView";

export default function myTask() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(initialMyTasksFilter);
  const { tasks } = useSelector((state) => state.board);

  useEffect(() => {
    if (filters?.projectId != "") {
      // dummy API
      const data = dummyData.find(
        (project) => project.id === parseInt(filters?.projectId),
      );
      if (data) {
        dispatch(setBoard(data));
      }
    }
  }, [filters, setFilters]);

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

      {/* Content */}
      {filters.view === "Grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Object.values(tasks).map((task) => (
            <MyTaskRowCard
              key={task.id}
              task={task}
              projectId={filters?.projectId}
            />
          ))}
        </div>
      ) : (
        <MyTaskTableView tasks={tasks} projectId={filters?.projectId} />
      )}
    </div>
  );
}
