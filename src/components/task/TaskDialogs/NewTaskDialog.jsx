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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";

export default function NewTaskDialog({ open, setOpen, columnId }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    dueDate: "",
    // subtasks: [],
  });

  // const [subtaskInput, setSubtaskInput] = useState("");

  const users = ["Alice Johnson", "Olivia Brown", "Daniel Kim"];

  const handleChange = (field, value) => {
    setTask((prev) => ({ ...prev, [field]: value }));
  };

  // const addSubtask = () => {
  //   if (!subtaskInput.trim()) return;

  //   setTask((prev) => ({
  //     ...prev,
  //     subtasks: [
  //       ...prev.subtasks,
  //       {
  //         id: "",
  //         title: subtaskInput,
  //         completed: false,
  //       },
  //     ],
  //   }));

  // setSubtaskInput("");
  // };

  // const removeSubtask = (id) => {
  //   setTask((prev) => ({
  //     ...prev,
  //     subtasks: prev.subtasks.filter((s) => s.id !== id),
  //   }));
  // };

  // const toggleSubtask = (id) => {
  //   setTask((prev) => ({
  //     ...prev,
  //     subtasks: prev.subtasks.map((s) =>
  //       s.id === id ? { ...s, completed: !s.completed } : s,
  //     ),
  //   }));
  // };

  const onCloseNewTaskModal = () => {
    setOpen(false);
    setTask({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      dueDate: "",
      subtasks: [],
    });
    setSubtaskInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...task,
      id: `T-${Date.now()}`,
      columnId: columnId ? columnId : "todo",
      order: Date.now(),
    };

    console.log(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} onClose={onCloseNewTaskModal}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg fontbold mb-2">
              Create New Task
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Task title"
                value={task.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Add details..."
                value={task.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Priority + Assignee */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={task.priority}
                  onValueChange={(val) => handleChange("priority", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select
                  value={task.assignee}
                  onValueChange={(val) => handleChange("assignee", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={task.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />
            </div>

            {/* Subtasks */}
            {/* <div className="space-y-3">
              <Label>Subtasks</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add subtask..."
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                />
                <Button type="button" size="icon" onClick={addSubtask}>
                  <Plus size={16} />
                </Button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between border rounded-md px-2 py-1"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={sub.completed}
                        onCheckedChange={() => toggleSubtask(sub.id)}
                      />
                      <span
                        className={`text-sm ${
                          sub.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {sub.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSubtask(sub.id)}
                      className="text-red-500"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
