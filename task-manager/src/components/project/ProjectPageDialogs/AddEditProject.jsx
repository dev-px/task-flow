"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import usePermissions from "@/hooks/usePermissions";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initialProjectState } from "@/utils/constant";
import {
  useProjectCreationMutation,
  useUpdateProjectMutation,
} from "@/redux/services/projectApi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddEditProject({
  showModal,
  setShowModal,
  type,
  projectId,
  form,
  setForm,
}) {
  const params = useParams();
  const { hasPermission } = usePermissions();
  const orgId = params?.organizationId;

  // Initialize mutations
  const [projectCreation, { isLoading: isCreating }] =
    useProjectCreationMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const isProcessing = isCreating || isUpdating;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    if (isProcessing) return; // Prevent closing while API is running
    setShowModal(false);
    setForm(initialProjectState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (type === "create") {
        await projectCreation({
          orgId,
          title: form.name, // Ensure payload keys match your Joi schema
          description: form.description,
          status: form.status,
          priority: form.priority,
        }).unwrap();
        toast.success("Project created successfully");
      } else {
        await updateProject({
          orgId,
          projectId,
          title: form.name,
          description: form.description,
          status: form.status,
          priority: form.priority,
          startDate: form.startDate,
          dueDate: form.dueDate,
        }).unwrap();
        toast.success("Project updated successfully");
      }
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || `Failed to ${type} project`);
    }
  };

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
                disabled={isProcessing}
              />
            </div>
            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief about the project..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isProcessing}
              />
            </div>
            {/* Status & Priority */}
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
                      disabled={isProcessing}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={form.priority}
                      onValueChange={(val) => handleChange("priority", val)}
                      disabled={isProcessing}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
            {/* Dates */}
            {type === "edit" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={form.startDate?.split("T")[0] || ""}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={form.dueDate?.split("T")[0] || ""}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isProcessing}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {type === "create" ? "Create Project" : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
