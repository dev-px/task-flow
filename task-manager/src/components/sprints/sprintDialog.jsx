"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Target,
  Rocket,
  Trash2,
  Flag,
  Users,
} from "lucide-react";
import { initialSprint } from "@/utils/constant";

const epicOptions = [
  {
    id: "EPIC-1",
    title: "Authentication System",
  },
  {
    id: "EPIC-2",
    title: "Landing Page Revamp",
  },
  {
    id: "EPIC-3",
    title: "Performance Optimization",
  },
];

export default function SprintDialog({
  open,
  setOpen,
  mode = "create", // create | edit
  sprint = null,
  setSelectedSprint,
}) {
  const [form, setForm] = useState(initialSprint);

  useEffect(() => {
    if (mode === "edit" && sprint) {
      setForm({
        name: sprint.name || "",
        goal: sprint.goal || "",
        startDate: sprint.startDate || "",
        endDate: sprint.endDate || "",
        status: sprint.status || "planned",
        memberCapacity: sprint.memberCapacity || "",
        velocityTarget: sprint.velocityTarget || "",
        epicId: sprint.epicId || "",
      });
    } else {
      setSelectedSprint(null);
      setForm(initialSprint);
    }
  }, [mode, sprint, open]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      id: mode === "edit" ? sprint?.id : `SPR-${Date.now()}`,
    };

    console.log("Sprint Payload:", payload);

    setOpen(false);
  };

  const handleDeleteSprint = () => {
    console.log("Delete Sprint:", sprint?.id);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setSelectedSprint(null);
      }}
    >
      <DialogContent className="sm:max-w-xl rounded-3xl hide-scrollbar">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-2 bg-background">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                {mode === "edit" ? "Edit Sprint" : "Create Sprint"}
              </DialogTitle>

              <DialogDescription className="text-sm">
                Plan your sprint, define the goal, assign timeline and connect
                work to the right epic.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
            {/* Sprint Name */}
            <div className="space-y-2">
              <Label>Sprint Name</Label>
              <Input
                placeholder="Sprint 3"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Sprint Goal
              </Label>
              <Textarea
                placeholder="What should this sprint achieve?"
                value={form.goal}
                onChange={(e) => handleChange("goal", e.target.value)}
                className="min-h-16"
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Start Date
                </Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  End Date
                </Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Status + Epic */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(val) => handleChange("status", val)}
                >
                  <SelectTrigger className={`w-full`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Link Epic
                </Label>
                <Select
                  value={form.epicId}
                  onValueChange={(val) => handleChange("epicId", val)}
                >
                  <SelectTrigger className={`w-full`}>
                    <SelectValue placeholder="Select epic" />
                  </SelectTrigger>
                  <SelectContent>
                    {epicOptions.map((epic) => (
                      <SelectItem key={epic.id} value={epic.id}>
                        {epic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Capacity */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Capacity
                </Label>
                <Input
                  placeholder="Example: 5 members"
                  value={form.memberCapacity}
                  onChange={(e) =>
                    handleChange("memberCapacity", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Velocity Target</Label>
                <Input
                  placeholder="Example: 32 story points"
                  value={form.velocityTarget}
                  onChange={(e) =>
                    handleChange("velocityTarget", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Small info block */}
          </div>

          {/* Footer */}
          <DialogFooter className="border-t px-6 py-5 flex items-center justify-between">
            <div>
              {mode === "edit" && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteSprint}
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  Delete Sprint
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setSelectedSprint(null);
                }}
              >
                Cancel
              </Button>

              <Button type="submit">
                {mode === "edit" ? "Save Changes" : " Create Sprint"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
