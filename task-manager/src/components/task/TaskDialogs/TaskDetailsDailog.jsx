"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import SubTaskStatus from "../SubTaskStatus";

export default function TaskDetailsDialog({
  openTaskDialog,
  setOpenTaskDialog,
  task,
  projectId,
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    status: "",
    storyPoints: 0,
    priority: "",
    assignee: "",
    taskId: "",
  });

  const updateField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    setForm({
      title: task?.title || "",
      status: task?.status || "",
      storyPoints: task?.storyPoints || 0,
      priority: task?.priority || "",
      assignee: task?.assignee || "",
      taskId: task?.id,
    });
  }, [task, openTaskDialog]);

  const closeDialog = () => {
    setForm({
      title: "",
      status: "",
      storyPoints: 0,
      priority: "",
      assignee: "",
      taskId: "",
    });
    setOpenTaskDialog(false);
  };

  const handleSave = () => {
    closeDialog();
  };

  return (
    <Dialog open={openTaskDialog} onOpenChange={() => setOpenTaskDialog(false)}>
      <DialogContent className="max-w-md space-y-2 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.title || "Task"}</DialogTitle>
        </DialogHeader>

        <Input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Status</Label>
            <Select
              onValueChange={(v) => updateField("status", v)}
              className="w-full"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Priority</Label>
            <Select onValueChange={(v) => updateField("priority", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Story Points</Label>
            <Input
              type="number"
              placeholder="Story Points"
              value={form.storyPoints || ""}
              onChange={(e) => updateField("storyPoints", e.target.value)}
            />
          </div>

          <div>
            <Label>Due Date</Label>
            <Input
              type="date"
              value={form.dueDate || ""}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Assignee</Label>
          <Select onValueChange={(v) => updateField("assignee", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alice">Alice</SelectItem>
              <SelectItem value="John">John</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* subtask progress bar */}
        <div>
          <Label>Subtask Status</Label>
          <SubTaskStatus subtasks={task?.subtasks || []} />
        </div>

        <Button
          variant="outline"
          onClick={() =>
            router.push(`/projects/${projectId}/taskdetails/${task?.id}`)
          }
          className="w-full flex items-center justify-center gap-2 hover:text-black"
        >
          Open Full Task
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>

        <div
          className="w-auto flex gap-2"
          style={{ justifyContent: "flex-end" }}
        >
          <Button variant="secondary" onClick={() => setOpenTaskDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
