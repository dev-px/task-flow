"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Plus,
  FileText,
  Trash2,
  ExternalLink,
  Paperclip,
  AlertTriangle,
} from "lucide-react";

const tabs = ["general", "members", "timeline", "links", "documents", "danger"];

export default function ProjectSettingsPage() {
  const router = useRouter();
  const { projectId } = useParams();
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    description: "",
    logo: "",
    status: "",
    visibility: "",
    members: [],
    startDate: "",
    endDate: "",
    links: [],
    documents: [],
  });
  const [member, setMember] = useState("");
  const [urls, setUrls] = useState({ label: "", link: "" });
  const [fileState, setFileState] = useState({
    file: null,
    name: "",
    size: 0,
    type: "",
    label: "",
  });
  const [activeTab, setActiveTab] = useState("general");

  const currentIndex = tabs.indexOf(activeTab);

  const nextTab = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // validate links
  // Helper: Check if URL is absolute
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

  const updateForm = (key, value) => {
    if (Array.isArray(settingsForm[key])) {
      setSettingsForm((prev) => ({
        ...prev,
        [key]: [...prev[key], value],
      }));
      setMember("");
      setUrls({ label: "", link: "" });
      setFileState({
        file: null,
        name: "",
        size: 0,
        type: "",
        label: "",
      });
    } else {
      setSettingsForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const removeItemFromSettings = (key, id) => {
    if (Array.isArray(settingsForm[key])) {
      setSettingsForm((prev) => ({
        ...prev,
        [key]: prev[key].filter((_, index) => index !== id),
      }));
    }
  };

  useEffect(() => {
    console.log(settingsForm);
  }, [settingsForm]);

  return (
    <div className="p-4 md:p-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col gap-6"
      >
        {/* tabs header */}
        <div className="overflow-x-auto hide-scrollbar">
          <TabsList className="flex justify-between items-center w-full bg-transparent p-0 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  "px-4 py-2 text-base font-medium transition",
                  activeTab === tab
                    ? "border-black text-black"
                    : "border-transparent text-muted-foreground hover:text-black",
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* project general info */}
        <TabsContent value="general">
          <Card
            title="General Settings"
            description="Basic details about your project."
          >
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                placeholder="e.g. Apollo Dashboard"
                value={settingsForm?.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="What is this project about?"
                className="min-h-16"
                value={settingsForm?.description}
                onChange={(e) => updateForm("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Input
                  placeholder="Active"
                  value={settingsForm.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Input
                  placeholder="Public"
                  value={settingsForm.visibility}
                  onChange={(e) => updateForm("visibility", e.target.value)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* project members */}
        <TabsContent value="members">
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
                <Button onClick={() => updateForm("members", member)}>
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {settingsForm?.members?.length > 0 ? (
                settingsForm.members.map((member, index) => (
                  <MemberRow
                    key={index}
                    name={member.name}
                    email={member.email}
                    role={member.role}
                    onRemove={() => removeItemFromSettings("members", index)}
                  />
                ))
              ) : (
                <NoDataPlaceHolder title="members" />
              )}
            </div>
          </Card>
        </TabsContent>

        {/* project timeline */}
        <TabsContent value="timeline">
          <Card title="Timeline" description="Set project start and due dates.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={settingsForm?.startDate}
                  onChange={(e) => updateForm("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={settingsForm?.dueDate}
                  onChange={(e) => updateForm("dueDate", e.target.value)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* project links */}
        <TabsContent value="links">
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
                <NoDataPlaceHolder title=" links" />
              )}
            </div>
          </Card>
        </TabsContent>

        {/* additional documents */}
        <TabsContent value="documents">
          <Card
            title="Assets & Docs"
            description="Upload PDFs, SRS, or Design specs."
          >
            <div className="space-y-4">
              {/* Upload Section */}
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
                    onClick={() => {
                      updateForm("documents", fileState);
                      setFileState({
                        file: null,
                        name: "",
                        size: 0,
                        type: "",
                        label: "",
                      });
                    }}
                    disabled={!isDocValid}
                  >
                    Add Doc
                  </Button>
                </div>
              </div>

              {/* Documents List */}
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

        {/* DANGER */}
        <TabsContent value="danger">
          <Card
            title="Danger Zone"
            description="Proceed with caution. These actions are irreversible."
          >
            <DangerZone />
          </Card>
        </TabsContent>
      </Tabs>

      {/* footer */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
        <Button
          variant="outline"
          onClick={prevTab}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            onClick={() => router.push(`/projects/${projectId}`)}
          >
            Cancel
          </Button>
          <Button>Save</Button>
          <Button onClick={nextTab} disabled={currentIndex === tabs.length - 1}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

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
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
}

function TeamRow({ name }) {
  return (
    <div className="flex justify-between items-center border p-3 rounded-lg">
      <p className="font-medium">{name}</p>
      <Button variant="outline" size="sm">
        Remove
      </Button>
    </div>
  );
}

function DangerZone() {
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
        >
          Archive
        </Button>
      </div>
      <div className="flex-1 p-4 bg-white rounded-lg border border-destructive/20">
        <p className="text-sm font-bold">Delete Project</p>
        <p className="text-xs text-muted-foreground mb-3">
          Permanently remove all data.
        </p>
        <Button variant="destructive">Delete Project</Button>
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
