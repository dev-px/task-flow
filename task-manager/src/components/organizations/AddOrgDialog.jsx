"use client";

import React from "react";
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
import { Label } from "@/components/ui/label";
import { initialOrgFilterState } from "@/utils/constant";
import {
  useOrgCreationMutation,
  useOrgDeleteMutation,
  useOrgEditMutation,
} from "@/redux/services/orgApi";

const OrganizationDialog = ({
  showModal,
  setShowModal,
  form,
  setForm,
  type = "create",
}) => {
  const [
    orgCreation,
    { isLoading: isOrgCreationLoading, isError: orgCreationError },
  ] = useOrgCreationMutation();
  const [
    orgDelete,
    { isLoading: isOrgDeleteLoading, isError: orgDeleteError },
  ] = useOrgDeleteMutation();
  const [orgEdit, { isLoading: isOrgEditLoading, isError: orgEditError }] =
    useOrgEditMutation();

  const isEdit = type === "edit";

  const closeModal = () => {
    setShowModal(false);
    setForm(initialOrgFilterState);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Entire Form Object:", form, form._id, form.name);
    try {
      if (isEdit) {
        const data = {
          name: form.name,
          description: form.description,
          logoUrl: form.logoUrl,
          companyEmail: form.companyEmail,
          companyPhone: form.companyPhone,
          website: form.website,
          address: form.address,
          timezone: form.timezone,
          defaultLanguage: form.defaultLanguage,
          businessHours: form.businessHours,
        };
        await orgEdit({ orgId: form._id, ...data }).unwrap();

        toast.success("Organization updated successfully!");
      } else {
        await orgCreation({
          name: form.name,
          description: form.description,
        }).unwrap();
        toast.success("Organization created successfully!");
      }

      // 4. Only close the modal and clear the form if the API call was successful
      closeModal();
    } catch (error) {
      // 5. Catch any errors from the backend (like 400 Bad Request or 500 Server Error)
      console.error("Failed to save organization:", error);
      // Add your error toast notification here using error?.data?.message
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={closeModal}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-bold text-xl mb-4">
              {isEdit ? "Edit Organization" : "Add New Organization"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input
                placeholder="e.g. Task Manager App"
                value={form?.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief about the organization..."
                value={form?.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {isEdit && (
              <>
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={form?.logoUrl || ""}
                    onChange={(e) => handleChange("logoUrl", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Email</Label>
                    <Input
                      type="email"
                      placeholder="contact@company.com"
                      value={form?.companyEmail || ""}
                      onChange={(e) =>
                        handleChange("companyEmail", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Phone</Label>
                    <Input
                      placeholder="+1 234 567 890"
                      value={form?.companyPhone || ""}
                      onChange={(e) =>
                        handleChange("companyPhone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={form?.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Input
                      placeholder="e.g. English, Spanish"
                      value={form?.defaultLanguage || ""}
                      onChange={(e) =>
                        handleChange("defaultLanguage", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    placeholder="123 Business Rd, Suite 100, City, Country"
                    value={form?.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Input
                      placeholder="e.g. UTC, America/New_York"
                      value={form?.timezone || ""}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Hours</Label>
                    <Input
                      placeholder="e.g. Mon-Fri, 9AM-5PM"
                      value={form?.businessHours || ""}
                      onChange={(e) =>
                        handleChange("businessHours", e.target.value)
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={closeModal}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{isEdit ? "Save Changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationDialog;
