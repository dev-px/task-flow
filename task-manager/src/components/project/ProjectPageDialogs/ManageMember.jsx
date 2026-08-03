"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useGetProjectByIdQuery,
} from "@/redux/services/projectApi";

export default function ManageMembersModal({ open, setOpen }) {
  const { organizationId, projectId } = useParams();
  const [search, setSearch] = useState("");

  // Assuming the project query populates project members in 'data.members'
  const { data: projectResponse } = useGetProjectByIdQuery(
    { orgId: organizationId, projectId },
    { skip: !organizationId || !projectId },
  );

  const [addMemberApi, { isLoading: isAdding }] = useAddProjectMemberMutation();
  const [removeMemberApi, { isLoading: isRemoving }] =
    useRemoveProjectMemberMutation();

  const currentMembers = projectResponse?.data?.members || [];

  // TODO: Replace with real organization users fetched from an API
  const orgUsers = [
    { id: "65b2a1c9e4f1a2001c8d4a5b", name: "Neha", email: "neha@example.com" },
    {
      id: "65b2a1c9e4f1a2001c8d4a5c",
      name: "Arjun",
      email: "arjun@example.com",
    },
  ];

  // Filter out users who are already in the project
  const availableUsers = orgUsers.filter(
    (u) => !currentMembers.some((cm) => cm.memberId === u.id),
  );

  const filteredUsers = availableUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddMember = async (userId) => {
    // Note: You must provide a valid roleId from your database roles
    const fallbackRoleId = "65c3b2d1f4a1a3001d9e5b6c";
    try {
      await addMemberApi({
        orgId: organizationId,
        projectId,
        memberId: userId,
        roleId: fallbackRoleId,
      }).unwrap();
      toast.success("Member added to project");
      setSearch("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMemberApi({
        orgId: organizationId,
        projectId,
        memberId,
      }).unwrap();
      toast.success("Member removed");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove member");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <div className="border rounded-md p-2 space-y-2 max-h-40 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between px-2 py-1 hover:bg-muted rounded"
                  >
                    <span className="text-sm">{user.name}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddMember(user.id)}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground px-2">
                  No available users found
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Project Members</p>
            {currentMembers.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No members assigned.
              </p>
            )}
            {currentMembers.map((member) => (
              <div
                key={member.memberId}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{member.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.name || "Unknown User"}
                    </p>
                    <Badge variant="secondary" className="text-xs font-normal">
                      Project Member
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  disabled={isRemoving}
                  onClick={() => handleRemoveMember(member.memberId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
