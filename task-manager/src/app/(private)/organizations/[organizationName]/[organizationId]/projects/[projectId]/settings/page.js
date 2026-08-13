"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Trash2,
  ExternalLink,
  Paperclip,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

// Assuming these paths match your project structure
import { initialProjectSettingForm } from "@/utils/constant";
import TabsCompo from "@/components/layout/TabsCompo";
import TaskFooter from "@/components/layout/TaskFooter";
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/redux/services/projectApi";
import usePermissions from "@/hooks/usePermissions";

const tabs = ["members", "links", "documents", "danger"];

export default function ProjectSettingsPage() {
  const { organizationId, projectId } = useParams();
  const { hasPermission } = usePermissions();
  const [settingsForm, setSettingsForm] = useState(initialProjectSettingForm);
  const [member, setMember] = useState("");
  const [urls, setUrls] = useState({ label: "", link: "" });
  const [fileState, setFileState] = useState({
    file: null,
    name: "",
    size: 0,
    type: "",
    label: "",
  });
  const [activeTab, setActiveTab] = useState("members");
  const [initialData, setInitialData] = useState(null);

  const currentIndex = tabs.indexOf(activeTab);

  // --- API HOOKS ---
  const { data: projectResponse, isLoading: isFetching } =
    useGetProjectByIdQuery(
      { orgId: organizationId, projectId },
      { skip: !organizationId || !projectId || !hasPermission("project:edit") },
    );

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const nextTab = () => {
    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
  };

  const prevTab = () => {
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
  };

  // --- VALIDATION ---
  const isValidUrl = (url) =>
    url.startsWith("https://") || url.startsWith("http://");
  const isLinkTabValid = urls.label.trim() !== "" && isValidUrl(urls.link);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

  const isFileSizeValid = fileState.size <= MAX_FILE_SIZE;
  const isFileTypeValid = ALLOWED_TYPES.includes(fileState.type);
  const isDocValid =
    fileState.file &&
    fileState.label.trim() !== "" &&
    isFileSizeValid &&
    isFileTypeValid;

  // --- POPULATE INITIAL DATA ---
  useEffect(() => {
    const data = projectResponse?.data;
    if (data) {
      const formattedData = {
        name: data.title || "",
        description: data.description || "",
        logo: data.logo || "",
        status: data.status || "",
        visibility: data.visibility || "",
        members: data.members || [],
        startDate: data.startDate || "",
        dueDate: data.dueDate || "",
        links: data.links || [],
        documents: data.documents || [],
      };

      setSettingsForm(formattedData);
      setInitialData(formattedData);
    }
  }, [projectResponse]);

  const getChangedFields = (initial, current) => {
    const changes = {};
    Object.keys(current).forEach((key) => {
      // deep compare for arrays/objects
      if (JSON.stringify(initial?.[key]) !== JSON.stringify(current?.[key])) {
        changes[key] = current[key];
      }
    });
    return changes;
  };

  // Update local form state (no API call yet)
  const updateForm = (key, value) => {
    setSettingsForm((prev) => {
      if (Array.isArray(prev[key])) {
        return { ...prev, [key]: [...prev[key], value] };
      }
      return { ...prev, [key]: value };
    });

    // Reset temp inputs
    setMember("");
    setUrls({ label: "", link: "" });
    setFileState({ file: null, name: "", size: 0, type: "", label: "" });
  };

  const removeItemFromSettings = (key, id) => {
    if (Array.isArray(settingsForm[key])) {
      setSettingsForm((prev) => ({
        ...prev,
        [key]: prev[key].filter((_, index) => index !== id),
      }));
    }
  };

  // --- SAVE TO API ---
  const handleSave = async () => {
    if (!initialData) return;

    const changedData = getChangedFields(initialData, settingsForm);

    if (Object.keys(changedData).length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      await updateProject({
        orgId: organizationId,
        projectId,
        body: changedData,
      }).unwrap();

      toast.success("Project settings updated!");
      setInitialData(settingsForm); // Sync local state with database
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update project settings");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-3">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col gap-0"
      >
        <TabsCompo tabs={tabs} activeTab={activeTab} />

        {/* PROJECT MEMBERS */}
        <TabsContent value="members" className="my-6">
          <Card
            title="Members"
            description="Invite collaborators to your project."
          >
            <div className="space-y-2">
              <Label>Add Member</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email/name"
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                />
                <Button
                  onClick={() =>
                    updateForm("members", { name: member, role: "Member" })
                  }
                  disabled={!member.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {settingsForm?.members?.length > 0 ? (
                settingsForm.members.map((memberItem, index) => (
                  <MemberRow
                    key={index}
                    name={memberItem.name || memberItem.email}
                    role={memberItem.role}
                    onRemove={() => removeItemFromSettings("members", index)}
                  />
                ))
              ) : (
                <NoDataPlaceHolder title="members" />
              )}
            </div>
          </Card>
        </TabsContent>

        {/* PROJECT LINKS */}
        <TabsContent value="links" className="my-6">
          <Card
            title="Links & Integrations"
            description="Connect GitHub, Figma, or documentation."
          >
            <div className="flex gap-2 justify-center w-full flex-col md:flex-row">
              <Input
                placeholder="Label (e.g., GitHub)"
                value={urls.label}
                onChange={(e) => setUrls({ ...urls, label: e.target.value })}
              />
              <Input
                placeholder="https://..."
                value={urls.link}
                className={
                  urls.link && !isValidUrl(urls.link)
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                onChange={(e) => setUrls({ ...urls, link: e.target.value })}
              />
              <Button
                onClick={() => updateForm("links", urls)}
                disabled={!isLinkTabValid}
              >
                Add Link
              </Button>
            </div>
            <p
              className={`text-xs mt-2 ${urls.link && !isValidUrl(urls.link) ? "text-red-500 font-medium" : "text-muted-foreground"}`}
            >
              Links must start with http:// or https://
            </p>

            <div className="space-y-2">
              {settingsForm?.links?.length > 0 ? (
                settingsForm.links.map((link, index) => (
                  <div
                    className="flex justify-between items-center border p-3 rounded-lg"
                    key={index}
                  >
                    <div>
                      <p className="font-medium">{link.label}</p>
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link.link}
                      </a>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItemFromSettings("links", index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <NoDataPlaceHolder title="links" />
              )}
            </div>
          </Card>
        </TabsContent>

        {/* ADDITIONAL DOCUMENTS */}
        <TabsContent value="documents" className="my-6">
          <Card
            title="Assets & Docs"
            description="Upload PDFs, SRS, or Design specs."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> Upload File
                </Label>
                <div className="flex gap-2 flex-col md:flex-row">
                  <Input
                    placeholder="Document Label (e.g., Final Report)"
                    value={fileState.label}
                    onChange={(e) =>
                      setFileState({ ...fileState, label: e.target.value })
                    }
                  />
                  <Input
                    type="file"
                    key={fileState.file ? "loaded" : "empty"}
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setFileState({
                          file: selectedFile,
                          name: selectedFile.name,
                          size: selectedFile.size,
                          type: selectedFile.type,
                          label: fileState.label || selectedFile.name,
                        });
                      }
                    }}
                  />
                  <Button
                    onClick={() => updateForm("documents", fileState)}
                    disabled={!isDocValid}
                  >
                    Add Doc
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {settingsForm?.documents?.length > 0 ? (
                  settingsForm.documents.map((doc, index) => (
                    <div
                      className="flex justify-between items-center border p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors"
                      key={index}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-md dark:bg-blue-900/30">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm leading-none">
                            {doc.label || "Untitled Document"}
                          </p>
                          {doc.link && (
                            <a
                              href={doc.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-blue-500 flex items-center gap-1 mt-1"
                            >
                              View File <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          removeItemFromSettings("documents", index)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <NoDataPlaceHolder title="documents" />
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* DANGER ZONE */}
        <TabsContent value="danger" className="my-6">
          <Card
            title="Danger Zone"
            description="Proceed with caution. These actions are irreversible."
          >
            <DangerZone organizationId={organizationId} projectId={projectId} />
          </Card>
        </TabsContent>
      </Tabs>

      {/* FOOTER */}
      <TaskFooter
        currentIndex={currentIndex}
        prevTab={prevTab}
        nextTab={nextTab}
        len={tabs.length}
        projectId={projectId}
        onSave={handleSave}
        isSaving={isUpdating} // Passes loading state to footer button
      />
    </div>
  );
}

// --- SUBCOMPONENTS ---

function Card({ title, description, children }) {
  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4 mt-2">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function MemberRow({ name, role, onRemove }) {
  return (
    <div className="flex justify-between items-center border p-3 rounded-lg">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{role || "Member"}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
}

function DangerZone({ organizationId, projectId }) {
  const router = useRouter();
  const [updateProject, { isLoading: isArchiving }] =
    useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const handleArchive = async () => {
    try {
      await updateProject({
        orgId: organizationId,
        projectId,
        body: { status: "archived" },
      }).unwrap();
      toast.success("Project archived successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to archive project");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this project?",
      )
    )
      return;

    try {
      await deleteProject({ orgId: organizationId, projectId }).unwrap();
      toast.success("Project deleted permanently");
      router.push(`/org/${organizationId}/projects`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 p-4 bg-white rounded-lg border border-destructive/20">
        <p className="text-sm font-bold">Archive Project</p>
        <p className="text-xs text-muted-foreground mb-3">
          Make the project read-only.
        </p>
        <Button
          variant="outline"
          className="text-destructive hover:bg-destructive hover:text-white"
          onClick={handleArchive}
          disabled={isArchiving || isDeleting}
        >
          {isArchiving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Archive
        </Button>
      </div>
      <div className="flex-1 p-4 bg-white rounded-lg border border-destructive/20">
        <p className="text-sm font-bold">Delete Project</p>
        <p className="text-xs text-muted-foreground mb-3">
          Permanently remove all data.
        </p>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isArchiving || isDeleting}
        >
          {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Delete Project
        </Button>
      </div>
    </div>
  );
}

function NoDataPlaceHolder({ title }) {
  return (
    <div className="text-center py-6">
      <p className="text-sm text-muted-foreground">No {title} added yet.</p>
    </div>
  );
}
