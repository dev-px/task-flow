"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Rocket,
  ClipboardList,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";
import ProjectHeader from "./../../../../components/project/ProjectHeader";
import StatusCards from "@/components/project/StatusCards";
import TaskDetailsDialog from "@/components/task/TaskDialogs/TaskDetailsDailog";
import { useDispatch, useSelector } from "react-redux";
import { dummyData } from "@/utils/helper";
import { setBoard } from "@/redux/slices/boardSlice";
import NewTaskDialog from "@/components/task/TaskDialogs/NewTaskDialog";
import SprintDialog from "@/components/sprints/sprintDialog";

function PriorityBadge({ value }) {
  const map = {
    Critical: "destructive",
    High: "default",
    Medium: "secondary",
    Low: "outline",
  };

  return <Badge variant={map[value] || "secondary"}>{value}</Badge>;
}

export default function BacklogPageUI() {
  const { projectId } = useParams();
  const [search, setSearch] = useState("");
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openNewBacklogTask, setOpenNewBacklogTask] = useState(false);
  const [openSprintDialog, setOpenSprintDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const dispatch = useDispatch();
  const {
    columns,
    columnOrder,
    columnTaskIds,
    backlogTaskIds,
    sprints,
    tasks,
  } = useSelector((state) => state.board);
  // dummy API
  const data = dummyData.find((project) => project.id === parseInt(projectId));

  useEffect(() => {
    if (data) {
      dispatch(setBoard(data));
    }
  }, [data]);

  const backlogStats = [
    { label: "Backlog Tasks", value: "24", icon: ClipboardList },
    { label: "Active Sprint", value: "Sprint 1", icon: Rocket },
    { label: "Team Members", value: "5", icon: Users },
  ];

  useEffect(() => {
    console.log("columns:", columns);
    console.log("columnOrder:", columnOrder);
    console.log("columnTaskIds:", columnTaskIds);
    console.log("tasks:", tasks);
    console.log("backlogTaskIds:", backlogTaskIds);
    console.log("sprints:", sprints);
    console.log("selectedSprint:", selectedSprint);
  }, [
    columns,
    columnOrder,
    columnTaskIds,
    tasks,
    backlogTaskIds,
    sprints,
    selectedSprint,
  ]);

  return (
    <div className="p-3">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <ProjectHeader
          pTitle="Backlog"
          pDescription="Plan work, prioritize tasks, and move items into upcoming sprints."
          type="backlog"
          projectId={projectId}
          setOpenNewBacklogTask={setOpenNewBacklogTask}
          setOpenSprintDialog={setOpenSprintDialog}
          setSelectedSprint={setSelectedSprint}
        />

        {/* Backlog Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {backlogStats.map((item) => (
            <StatusCards
              key={item.label}
              Icon={item.icon}
              title={item.label}
              value={item.value}
            />
          ))}
        </div>

        {/* Backlog Section */}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          {/* Backlog Section */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* backlog card header */}
                <div>
                  <h2 className="text-lg font-semibold">Prioritized Backlog</h2>
                  <p className="text-sm text-muted-foreground">
                    Tasks waiting to be planned into a sprint
                  </p>
                </div>

                {/* backlog filter */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="min-w-60">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search backlog tasks"
                      className="rounded-xl"
                    />
                  </div>
                  <Select
                    // value={}
                    // onValueChange={}
                  >
                    <SelectTrigger className="w-28 h-10 rounded-lg">
                      <SelectValue placeholder="Filter Sprint" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="SPR-1">Sprint 1</SelectItem>
                      <SelectItem value="SPR-2">Sprint 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* backlog cards */}
              <div className="space-y-3">
                {backlogTaskIds.map((tId, index) => {
                  const task = tasks[tId];
                  return (
                    <div
                      key={tId}
                      onClick={() => {
                        setSelectedTask(task);
                        setOpenTaskDialog(true);
                      }}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-4 cursor-pointer hover:shadow-sm transition"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">
                              {task.id}
                            </span>
                            <PriorityBadge value={task.priority} />
                          </div>

                          <h3 className="font-medium text-sm">{task.title}</h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{task.assignee}</AvatarFallback>
                          </Avatar>

                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveToSprint(task.id);
                            }}
                          >
                            Move
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Sprint Planning */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-4">
                <h2 className="text-lg font-semibold">Sprint Planning</h2>

                {/* sprint cards */}
                {Object.values(sprints).map((sprint) => (
                  <div
                    key={sprint.id}
                    onClick={() => {
                      setSelectedSprint(sprint);
                      setOpenSprintDialog(true);
                    }}
                    className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-md hover:border-gray-300"
                  >
                    {/* Top Section */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-base text-gray-900 group-hover:text-black">
                          {sprint.name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {sprint.duration}
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          sprint.status === "active"
                            ? "bg-black text-white border-black"
                            : ""
                        }`}
                      >
                        {sprint.status.charAt(0).toUpperCase() +
                          sprint.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Goal */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                        Sprint Goal
                      </p>

                      <p className="text-sm text-gray-700 line-clamp-2">
                        {sprint.goal}
                      </p>
                    </div>

                    {/* Bottom Meta */}
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarDays className="w-4 h-4" />
                        <span>2 weeks</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm font-medium text-gray-700 group-hover:text-black">
                        View Details
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Task Details Dialog */}
      <TaskDetailsDialog
        openTaskDialog={openTaskDialog}
        setOpenTaskDialog={setOpenTaskDialog}
        task={selectedTask}
        projectId={projectId}
      />
      {/* New Backlog Task Creation*/}
      <NewTaskDialog
        open={openNewBacklogTask}
        setOpen={setOpenNewBacklogTask}
        page="backlog"
      />
      {/* Sprint Creation*/}
      <SprintDialog
        open={openSprintDialog}
        setOpen={setOpenSprintDialog}
        mode={selectedSprint?.id ? "edit" : "create"}
        sprint={selectedSprint}
        setSelectedSprint={setSelectedSprint}
      />
    </div>
  );
}

// Simple Card UI component (no shadcn needed)
export function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = "", children }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
