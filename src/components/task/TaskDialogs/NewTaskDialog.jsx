"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { addTask } from "@/redux/slices/boardSlice";
import { initialNewtaskForm } from "@/utils/constant";

export default function NewTaskDialog({
  open,
  setOpen,
  columnId,
  page = "board", // "board" | "backlog"
}) {
  const dispatch = useDispatch();

  const [task, setTask] = useState(initialNewtaskForm);

  // Example users
  const users = [
    { id: "U-1", name: "Alice Johnson" },
    { id: "U-2", name: "Olivia Brown" },
    { id: "U-3", name: "Daniel Kim" },
  ];

  // Example sprints
  const sprints = [
    { id: "SPR-1", name: "Sprint 1" },
    { id: "SPR-2", name: "Sprint 2" },
  ];

  const handleChange = (field, value) => {
    setTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setTask(initialNewtaskForm);
    setOpen(false);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    const taskId = `T-${Date.now()}`;

    const payload = {
      id: taskId,
      title: task.title,
      description: task.description,
      type: task.type,

      // if created from backlog page → backlog task
      // if created from board page → direct column task
      columnId: page === "backlog" ? "todo" : columnId || "todo",

      // board ordering
      columnOrder: Date.now(),

      // sprint logic
      sprintId: page === "backlog" ? null : task.sprintId || null,

      priority: task.priority,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,

      epicId: null,
      labels: [],
      reporterId: null,
      storyPoints: 0,

      subTasks: [],
      attachments: [],
      comments: [],
      activity: [],

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const reduxPayload = {
      payload: { ...payload },
      isBacklog: page === "backlog" ? false : true,
    };
    try {
      dispatch(addTask(reduxPayload));
    } catch (error) {
      console.error("Task creation failed", error);
    } finally {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl rounded-2xl">
        <form onSubmit={handleTaskSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {page === "backlog" ? "Create Backlog Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-5">
            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Enter task title"
                value={task.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Add task details..."
                value={task.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Type + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Task Type</Label>
                <Select
                  value={task.type}
                  onValueChange={(val) => handleChange("type", val)}
                >
                  <SelectTrigger className={`w-full`}>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={task.priority}
                  onValueChange={(val) => handleChange("priority", val)}
                >
                  <SelectTrigger className={`w-full`}>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignee + Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select
                  value={task.assigneeId}
                  onValueChange={(val) => handleChange("assigneeId", val)}
                >
                  <SelectTrigger className={`w-full`}>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>

                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                />
              </div>
            </div>

            {/* Sprint only for board page */}
            {page !== "backlog" && (
              <div className="space-y-2">
                <Label>Sprint</Label>
                <Select
                  value={task.sprintId}
                  onValueChange={(val) => handleChange("sprintId", val)}
                >
                  <SelectTrigger className={`w-full`}>
                    <SelectValue placeholder="Select sprint" />
                  </SelectTrigger>

                  <SelectContent>
                    {sprints.map((sprint) => (
                      <SelectItem key={sprint.id} value={sprint.id}>
                        {sprint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">
              {page === "backlog" ? "Create Backlog Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
