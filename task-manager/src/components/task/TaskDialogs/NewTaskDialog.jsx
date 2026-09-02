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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

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
            <div
              className={`grid gap-4 ${page === "backlog" ? "grid-cols-2" : ""}`}
            >
              <div className="space-y-2">
                <Label>Assignees</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal"
                    >
                      {/* Show count or names of selected users */}
                      {task?.assigneeIds?.length > 0
                        ? `${task.assigneeIds.length} selected`
                        : "Select assignees"}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="" align="start">
                    {users.map((user) => {
                      // Check if this user ID is already in the array
                      const isChecked = task?.assigneeIds?.includes(user.id);

                      return (
                        <DropdownMenuCheckboxItem
                          key={user.id}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            // Add or remove the ID from the array
                            const currentIds = task.assigneeIds || [];
                            const nextIds = checked
                              ? [...currentIds, user.id]
                              : currentIds.filter((id) => id !== user.id);

                            handleChange("assigneeIds", nextIds);
                          }}
                        >
                          {user.name}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className={`grid gap-4 ${page === "backlog" ? "block" : "hidden"}`}
              >
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                />
              </div>
            </div>
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
