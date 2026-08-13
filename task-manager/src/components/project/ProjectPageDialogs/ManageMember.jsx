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
import { X, Plus, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useGetAllMemberForProjectQuery,
} from "@/redux/services/projectApi";
import usePermissions from "@/hooks/usePermissions";

export default function ManageMembersModal({ open, setOpen }) {
  const { organizationId, projectId } = useParams();
  const { hasPermission } = usePermissions();

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState(null); // Tracks which specific button is loading

  // Fetch all members (both assigned and unassigned) directly from our aggregation API
  const { data: memberData, isFetching } = useGetAllMemberForProjectQuery(
    {
      orgId: organizationId,
      projectId,
      searchTerm, // Passes search to backend aggregation
    },
    {
      skip:
        !organizationId ||
        !projectId ||
        !hasPermission("project:edit"),
    },
  );

  const [addMemberApi] = useAddProjectMemberMutation();
  const [removeMemberApi] = useRemoveProjectMemberMutation();

  // Adjust this path based on how your backend controller formats the response
  // (e.g., res.json({ data: members }) vs res.json(members))
  const memberList = memberData?.data || memberData || [];

  const handleToggleMember = async (member) => {
    setLoadingId(member._id);

    try {
      if (member.isAssignedToProject) {
        // Remove Member
        await removeMemberApi({
          orgId: organizationId,
          projectId,
          memberId: member._id,
        }).unwrap();
        toast.success("Member removed from project");
      } else {
        // Add Member
        const fallbackRoleId = "65c3b2d1f4a1a3001d9e5b6c"; // Replace with dynamic role if needed
        await addMemberApi({
          orgId: organizationId,
          projectId,
          memberId: member._id,
          roleId: fallbackRoleId,
        }).unwrap();
        toast.success("Member added to project");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update member status");
    } finally {
      setLoadingId(null);
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
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="border rounded-md p-2 space-y-2 max-h-[60vh] overflow-y-auto">
            {isFetching && !memberList.length ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : memberList.length > 0 ? (
              memberList.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium truncate">
                        {member.name || "Unknown User"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </span>
                    </div>

                    {member.isAssignedToProject && (
                      <Badge
                        variant="secondary"
                        className="ml-2 text-[10px] h-5"
                      >
                        Assigned
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant={member.isAssignedToProject ? "ghost" : "default"}
                    size="icon"
                    className={`shrink-0 ml-2 ${
                      member.isAssignedToProject
                        ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                        : "bg-primary text-primary-foreground"
                    }`}
                    disabled={loadingId === member._id}
                    onClick={() => handleToggleMember(member)}
                  >
                    {loadingId === member._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : member.isAssignedToProject ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">
                No members found in this organization.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
