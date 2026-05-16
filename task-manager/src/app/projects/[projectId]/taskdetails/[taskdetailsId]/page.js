"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Circle, Trash2, MessageSquare } from "lucide-react";

import TabsCompo from "@/components/layout/TabsCompo";
import { AddSubtaskDialog } from "./../../../../../components/task/TaskDialogs/AddSubtaskDialog";
import TaskFooter from "@/components/layout/TaskFooter";
import { initialTaskDeatilsForm } from "@/utils/constant";

const tabs = ["general", "details", "subtasks", "attachments", "activity"];

export default function TaskDetailsPage() {
  const { taskdetailsId, projectId } = useParams();
  const { tasks } = useSelector((state) => state.board);

  const [activeTab, setActiveTab] = useState("general");
  const [newComment, setNewComment] = useState("");

  const [form, setForm] = useState(initialTaskDeatilsForm);

  const [open, setOpen] = useState(false);
  const [subtask, setSubtask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  useEffect(() => {
    if (tasks) {
      const task = tasks[taskdetailsId];

      if (task) {
        setForm({
          title: task.title || "",
          description: task.description || "",
          type: task.type || "task",
          status: task.status || "todo",
          priority: task.priority || "medium",
          assignee: task.assigneeId || "",
          reporterId: task.reporterId || "",
          epicId: task.epicId || "",
          sprintId: task.sprintId || null,
          columnId: task.columnId || "todo",
          columnOrder: task.columnOrder || 0,
          labels: task.labels || [],
          dueDate: task.dueDate || "",
          storyPoints: task.storyPoints || 0,
          comments: task.comments || [],
          attachments: task.attachments || [],
          activity: task.activity || [],
          createdAt: task.createdAt || "",
          updatedAt: task.updatedAt || "",
          subtasks: (task.subTasks || []).map((s) => ({
            id: s.id,
            title: s.title || "",
            done: s.completed || false,
            description: s.description || "",
            dueDate: s.dueDate || "",
            priority: s.priority || "medium",
          })),
        });
      }
    }
  }, [tasks, taskdetailsId]);

  const updateField = (k, v) => setForm((p) => ({ ...p, [k]: v ?? "" }));

  // update subtask
  const updateSubtask = (id, field, value) => {
    setForm((p) => ({
      ...p,
      subtasks: p.subtasks.map((s) =>
        s.id === id ? { ...s, [field]: value ?? "" } : s,
      ),
    }));
  };

  // remove subtask
  const removeSubtask = (id) => {
    setForm((p) => ({
      ...p,
      subtasks: p.subtasks.filter((s) => s.id !== id),
    }));
  };

  const handleAddSubtask = (newSubtask) => {
    setForm((p) => ({ ...p, subtasks: [...p.subtasks, newSubtask] }));
  };

  const handleAdd = () => {
    if (!subtask.title.trim()) return;

    handleAddSubtask({
      id: Date.now(),
      title: subtask.title,
      description: subtask.description,
      dueDate: subtask.dueDate,
      storyPoints: 0,
      status: "todo",
      priority: subtask.priority,
      done: false,
    });

    // Reset and close
    setSubtask({ title: "", description: "", dueDate: "", priority: "medium" });
    setOpen(false);
  };

  // add comments
  const addComment = () => {
    if (!newComment.trim()) return;
    setForm((p) => ({
      ...p,
      comments: [
        ...p.comments,
        {
          id: Date.now(),
          text: newComment,
          author: "Current User",
          date: new Date().toLocaleDateString(),
        },
      ],
    }));
    setNewComment("");
  };

  // Tab Navigation Logic
  const currentIndex = tabs.indexOf(activeTab);

  const prevTab = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const nextTab = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <div className="mx-auto flex flex-col">
      {/* HEADER */}
      <div className="space-y-1 mb-6 shrink-0">
        <Input
          value={form.title}
          placeholder="Task Title"
          onChange={(e) => updateField("title", e.target.value)}
          className="text-3xl font-bold border-transparent px-0 hover:border-border focus:border-border focus:px-3 transition-all h-auto py-2"
        />
        <div className="text-sm text-muted-foreground flex gap-4 px-1">
          <span>ID: {taskdetailsId || "TASK-123"}</span>
          <span>•</span>
          <span>Created recently</span>
        </div>
      </div>

      {/* scrollable content */}
      <div className="grow overflow-y-auto space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col gap-0"
        >
          <TabsCompo tabs={tabs} activeTab={activeTab} />

          {/* general tab */}
          <TabsContent value="general" className="space-y-8 my-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-semibold">General Information</h3>
                <p className="text-sm text-muted-foreground">
                  Manage task progress, ownership, description, and
                  collaboration.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-4 bg-slate-50/60 border rounded-xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => updateField("status", v)}
                    >
                      <SelectTrigger className="bg-background w-full h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={form.priority}
                      onValueChange={(v) => updateField("priority", v)}
                    >
                      <SelectTrigger className="bg-background w-full h-11">
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
                      value={form.assignee}
                      onValueChange={(v) => updateField("assignee", v)}
                    >
                      <SelectTrigger className="bg-background w-full h-11">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alice">Alice</SelectItem>
                        <SelectItem value="John">John</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <Label className="text-base font-medium">Description</Label>
                  <Textarea
                    className="min-h-32 text-base rounded-xl"
                    placeholder="Add a more detailed description..."
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <MessageSquare size={18} /> Comments
                </Label>
                <span className="text-sm text-muted-foreground">
                  {form.comments.length} total
                </span>
              </div>

              {form.comments.length === 0 ? (
                <div className="text-sm text-muted-foreground px-4 py-8 text-center bg-slate-50 rounded-xl border-2 border-dashed">
                  <p className="font-medium text-foreground">No comments yet</p>
                  <p className="mt-1">
                    Start collaboration by posting the first comment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.comments.map((c) => (
                    <CommentShow c={c} key={c.id} />
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border shadow-sm">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="resize-none min-h-24 bg-background border-transparent focus-visible:ring-1 focus-visible:ring-primary"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={addComment}
                    disabled={!newComment.trim()}
                    className="px-6"
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* subtask tab */}
          <TabsContent value="subtasks" className="space-y-4 mb-6 mt-1">
            <div className="flex items-center justify-between border-b">
              <div>
                <h3 className="text-lg font-semibold">Subtasks</h3>
                <p className="text-sm text-muted-foreground">
                  {form.subtasks.filter((s) => s.done).length} of{" "}
                  {form.subtasks.length} completed
                </p>
              </div>
              <AddSubtaskDialog
                onAdd={handleAddSubtask}
                open={open}
                setOpen={setOpen}
                handleAdd={handleAdd}
                subtask={subtask}
                setSubtask={setSubtask}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {form.subtasks.map((s) => (
                <SubTaskCompo
                  key={s.id}
                  s={s}
                  updateSubtask={updateSubtask}
                  removeSubtask={removeSubtask}
                />
              ))}

              {form.subtasks.length === 0 && (
                <NoTask
                  onAddTask={handleAddSubtask}
                  open={open}
                  setOpen={setOpen}
                  handleAdd={handleAdd}
                  subtask={subtask}
                  setSubtask={setSubtask}
                />
              )}
            </div>
          </TabsContent>

          {/* details tab */}
          <TabsContent value="details" className="space-y-8 my-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-semibold">Task Details</h3>
                <p className="text-sm text-muted-foreground">
                  Manage planning, ownership, estimates, and task metadata.
                </p>
              </div>
            </div>

            {/* Main Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/60 border rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Task Type</Label>
                  <Input
                    value={form.type}
                    readOnly
                    className="bg-background h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Epic ID</Label>
                  <Input
                    value={form.epicId}
                    onChange={(e) => updateField("epicId", e.target.value)}
                    className="bg-background h-11"
                    placeholder="Enter epic reference"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reporter</Label>
                  <Input
                    value={form.reporterId}
                    onChange={(e) => updateField("reporterId", e.target.value)}
                    className="bg-background h-11"
                    placeholder="Who created this task"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => updateField("dueDate", e.target.value)}
                    className="bg-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Story Points</Label>
                  <Input
                    type="number"
                    value={form.storyPoints}
                    onChange={(e) => updateField("storyPoints", e.target.value)}
                    className="bg-background h-11"
                    placeholder="Estimate effort"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Labels</Label>
                  <Input
                    value={form.labels.join(", ")}
                    onChange={(e) =>
                      updateField(
                        "labels",
                        e.target.value.split(",").map((i) => i.trim()),
                      )
                    }
                    className="bg-background h-11"
                    placeholder="ui, research, backend"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* attachment tab */}
          <TabsContent value="attachments" className="space-y-6 my-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-semibold">Attachments</h3>
                <p className="text-sm text-muted-foreground">
                  Manage files, notes, references, and supporting documents for
                  this task.
                </p>
              </div>
              <Button variant="outline">Add Attachment</Button>
            </div>

            {form.attachments.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50/60 text-center">
                <div className="mb-4 p-4 rounded-full bg-background shadow-sm">
                  <MessageSquare
                    size={28}
                    className="text-muted-foreground/50"
                  />
                </div>
                <h4 className="text-base font-medium">No attachments yet</h4>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Upload design files, requirement docs, screenshots, PDFs, or
                  research references so your team has everything in one place.
                </p>
                <Button className="mt-4">Upload File</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {form.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="border rounded-xl p-5 bg-card shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium text-base">{file.name}</p>
                        <p className="text-sm text-muted-foreground break-all">
                          {file.url}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* activity tab */}
          <TabsContent value="activity" className="space-y-6 my-6">
            <div className="border-b pb-3">
              <h3 className="text-lg font-semibold">Activity Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Track all important actions and updates related to this task.
              </p>
            </div>

            {form.activity.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50/60 text-center">
                <div className="mb-4 p-4 rounded-full bg-background shadow-sm">
                  <CheckCircle2
                    size={28}
                    className="text-muted-foreground/50"
                  />
                </div>
                <h4 className="text-base font-medium">No activity recorded</h4>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Task updates, status changes, assignments, and important
                  actions will appear here once activity starts happening.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.activity.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl p-5 bg-card shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Performed by {item.userId}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* footer */}
      <TaskFooter
        currentIndex={currentIndex}
        prevTab={prevTab}
        nextTab={nextTab}
        len={tabs.length}
        projectId={projectId}
      />
    </div>
  );
}

// for comments
function CommentShow({ c }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
        {c.author?.charAt(0) || "U"}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{c.author || "User"}</span>
          <span className="text-xs text-muted-foreground">
            {c.date || "Just now"}
          </span>
        </div>
        <div className="text-sm bg-muted/50 p-3 rounded-b-xl rounded-tr-xl border text-foreground">
          {c.text}
        </div>
      </div>
    </div>
  );
}

// when subtask exist
function SubTaskCompo({ s, updateSubtask, removeSubtask }) {
  return (
    <div
      className={`flex flex-col gap-4 border rounded-lg p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
        s.done ? "bg-slate-50 border-slate-200" : "bg-card"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => updateSubtask(s.id, "done", !s.done)}
          className="mt-1 text-muted-foreground hover:text-primary transition-colors shrink-0"
        >
          {s.done ? <CheckCircle2 className="text-green-500" /> : <Circle />}
        </button>

        {/* subtask title */}
        <Input
          value={s.title}
          placeholder="Subtask Title"
          className={`font-medium text-base border-transparent px-2 -ml-2 h-8 hover:border-border focus:border-border transition-all ${
            s.done ? "line-through text-muted-foreground" : ""
          }`}
          onChange={(e) => updateSubtask(s.id, "title", e.target.value)}
        />

        {/* remove subtask */}
        <Button
          size="icon"
          variant="ghost"
          className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0 ml-auto h-8 w-8"
          onClick={() => removeSubtask(s.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* subtask description */}
      <Textarea
        value={s.description}
        placeholder="Add a description..."
        className="resize-none border-transparent px-2 -ml-2 min-h-15 text-sm hover:border-border focus:border-border bg-transparent"
        onChange={(e) => updateSubtask(s.id, "description", e.target.value)}
      />

      {/* subtask due date + priority*/}
      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
        <div className="space-y-1">
          <Label>Due Date</Label>
          <Input
            type="date"
            value={s.dueDate}
            className="h-8 text-xs bg-transparent"
            onChange={(e) => updateSubtask(s.id, "dueDate", e.target.value)}
          />
        </div>

        {/* subtask priority */}
        <div className="space-y-1">
          <Label>Priority</Label>
          <Select
            value={s.priority}
            onValueChange={(v) => updateSubtask(s.id, "priority", v)}
          >
            <SelectTrigger className="h-8 text-xs bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// when no subtask exists
function NoTask({ onAddTask, open, setOpen, handleAdd, subtask, setSubtask }) {
  return (
    <div className="col-span-full py-6 flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-slate-50/50 text-muted-foreground">
      <div className="mb-4 p-4 bg-background rounded-full shadow-sm">
        <CheckCircle2 size={32} className="text-muted-foreground/50" />
      </div>
      <h4 className="text-base font-medium text-foreground">No subtasks yet</h4>
      <p className="text-sm mt-1 mb-4 text-center max-w-sm">
        Break this task down into smaller, actionable steps to make it easier to
        complete.
      </p>
      <AddSubtaskDialog
        onAdd={onAddTask}
        open={open}
        setOpen={setOpen}
        handleAdd={handleAdd}
        subtask={subtask}
        setSubtask={setSubtask}
      />
    </div>
  );
}
