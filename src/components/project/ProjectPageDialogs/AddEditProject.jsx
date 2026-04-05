"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

export default function AddEditProject({ showModal, setShowModal, type }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
    priority: "medium",
    startDate: "",
    dueDate: "",
    visibility: "private",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    e.preventDefault();

    const payload = {
      ...form,
      ownerId: "current-user-id",
    };

    console.log(payload);

    closeModal();
  };

  function closeModal() {
    setShowModal(!showModal);
    setForm({
      name: "",
      description: "",
      status: "active",
      priority: "medium",
      startDate: "",
      dueDate: "",
      visibility: "private",
    });
  }

  return (
    <Dialog open={showModal} onOpenChange={closeModal}>
      <DialogContent className="w-full">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-bold text-lg mb-2">
              {type === "edit" ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                placeholder="e.g. Task Manager App"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief about the project..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Status */}
            <div
              className={`grid ${type === "edit" ? "grid-cols-3" : "grid-cols-1"} gap-4`}
            >
              {type === "edit" && (
                <>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(val) => handleChange("status", val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={form.priority}
                      onValueChange={(val) => handleChange("priority", val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select
                  value={form.visibility}
                  onValueChange={(val) => handleChange("visibility", val)}
                  className="w-full!"
                >
                  <SelectTrigger className={"w-full"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            {type === "edit" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Teams + members */}
            {/* <div className="space-y-2">
                            <Label>Teams</Label>
                            <div className="space-y-2">
                                {teams.map((team) => (
                                    <div key={team.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={form.teams.includes(team.id)}
                                            onCheckedChange={() => toggleSelection("teams", team.id)}
                                        />
                                        <span className="text-sm">{team.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Members</Label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={form.members.includes(user.id)}
                                            onCheckedChange={() =>
                                                toggleSelection("members", user.id)
                                            }
                                        />
                                        <span className="text-sm">{user.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div> */}

            {/* visibility */}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {type === "edit" ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
