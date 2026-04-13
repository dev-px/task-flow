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

const tabs = ["general", "subtasks"];

export default function TaskDetailsPage() {
  const { taskdetailsId, projectId } = useParams();
  const columnData = useSelector((state) => state.board.columns);

  const [activeTab, setActiveTab] = useState("general");
  const [newComment, setNewComment] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee: "",
    comments: [],
    subtasks: [],
  });

  const [open, setOpen] = useState(false);
  const [subtask, setSubtask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  useEffect(() => {
    if (columnData) {
      const found = Object.values(columnData)
        .flatMap((col) => col.tasks)
        .find((t) => t.id === taskdetailsId);

      if (found) {
        setForm({
          title: found.title || "",
          description: found.description || "",
          status: found.status || "todo",
          priority: found.priority || "medium",
          assignee: found.assignee || "",
          comments: found.comments || [],
          subtasks: (found.subtasks || []).map((s) => ({
            id: s.id,
            title: s.title || "",
            description: s.description || "",
            dueDate: s.dueDate || "",
            storyPoints: s.storyPoints || 0,
            status: s.status || "todo",
            priority: s.priority || "medium",
            done: s.done || false,
          })),
        });
      }
    }
  }, [columnData, taskdetailsId]);

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
          <TabsContent value="general" className="space-y-6 my-6">
            {/* status + priority + Assignee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-5 border rounded-lg mb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => updateField("status", v)}
                  >
                    <SelectTrigger className="bg-background w-full">
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
                    <SelectTrigger className="bg-background w-full">
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

              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select
                  value={form.assignee}
                  onValueChange={(v) => updateField("assignee", v)}
                >
                  <SelectTrigger className="bg-background w-full">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alice">Alice</SelectItem>
                    <SelectItem value="John">John</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                className="min-h-16 text-base"
                placeholder="Add a more detailed description..."
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>

            {/* comment section */}
            <div>
              <Label className="flex items-center gap-2">
                <MessageSquare size={16} /> Comments
              </Label>

              <div>
                {form.comments.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic px-2 py-4 my-4 text-center bg-slate-50 rounded-lg border-2 border-dashed">
                    No comments yet. Be the first to start the conversation!
                  </div>
                ) : (
                  <div className="space-y-4 mb-4">
                    {form.comments.map((c) => (
                      <CommentShow c={c} key={c.id} />
                    ))}
                  </div>
                )}

                {/* comment input */}
                <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="resize-none min-h-20 bg-background border-transparent focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
                  />
                  <div className="flex justify-end">
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      Post Comment
                    </Button>
                  </div>
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
