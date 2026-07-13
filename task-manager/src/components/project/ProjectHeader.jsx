import { Pencil, Plus, Rocket, Settings, Users, ListTodo } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import usePermissions from "@/hooks/usePermissions";

export default function ProjectHeader({
  pTitle,
  pDescription,
  type,
  setShowManageMembersModal,
  projectId,
  handleProjectManipulation,
  setOpenNewBacklogTask,
  setOpenSprintDialog,
  setShowInviteModal,
  hasPermission,
  handleCreateEditDialog
}) {
  const Icon = type === "create" ? Plus : Pencil;
  const router = useRouter();

  return (
    <div className="flex justify-between items-center flex-col md:flex-row">
      <div className="flex flex-col gap-1 mb-4 self-start md:mb-0">
        <h1 className="font-bold text-xl">{pTitle}</h1>
        <p className="text-gray-500">{pDescription}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-between sm:justify-end w-full md:w-auto">
        {/* project create/edit */}
        {(type === "create" || type === "edit") && (
          <Button
            size="lg"
            className="flex-1 rounded-sm hover:bg-gray-800 cursor-pointer"
            onClick={() => handleProjectManipulation(true)}
          >
            <Icon size={18} />
            {type === "create" ? (
              <span className="hidden md:block">Create Project</span>
            ) : (
              <span className="hidden md:block">Edit Project</span>
            )}
          </Button>
        )}

        {/* project edit extra */}
        {type === "edit" && (
          <>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-sm cursor-pointer"
              onClick={() => setShowManageMembersModal(true)}
            >
              <Users size={18} />
              <span className="hidden md:block">Manage Members</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-sm cursor-pointer"
              onClick={() => router.push(`/projects/${projectId}/backlogs`)}
            >
              <ListTodo size={18} />{" "}
              {/* Fixed: You had Users icon here previously */}
              <span className="hidden md:block">Backlogs</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-sm cursor-pointer"
              onClick={() => router.push(`/projects/${projectId}/settings`)}
            >
              <Settings size={18} />
              <span className="hidden md:block">Settings</span>
            </Button>
          </>
        )}

        {/* project backlog */}
        {type === "backlog" && (
          <>
            <Button
              size="lg"
              className="flex-1 rounded-sm cursor-pointer"
              onClick={() => setOpenNewBacklogTask(true)}
            >
              <Plus size={18} />
              <span className="hidden md:block">Create Task</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-sm cursor-pointer"
              onClick={() => setOpenSprintDialog(true)}
            >
              <Rocket size={18} />
              <span className="hidden md:block">Create Sprint</span>
            </Button>
          </>
        )}

        {type === "organizations" && (
          <Button
            size="lg"
            className="flex-1 rounded-sm bg-black text-white hover:bg-gray-800 cursor-pointer"
            onClick={handleProjectManipulation}
          >
            <Plus size={18} className="mr-2" />
            <span className="hidden md:block">Create Organization</span>
          </Button>
        )}

        {/* member page */}
        {type === "members" && hasPermission("member:create") && (
          <Button
            size="lg"
            className="flex-1 rounded-sm bg-black text-white hover:bg-gray-800 cursor-pointer"
            onClick={() => setShowInviteModal(true)}
          >
            <Plus size={18} className="mr-2" />
            <span className="hidden md:block">Invite Member</span>
          </Button>
        )}

        {type === "roles" && hasPermission("role:create") && (
          <Button
            size="lg"
            className="flex-1 rounded-sm bg-black text-white hover:bg-gray-800 cursor-pointer"
            onClick={handleCreateEditDialog}
          >
            <Plus size={18} className="mr-2" />
            <span className="hidden md:block">Create Role</span>
          </Button>
        )}
      </div>
    </div>
  );
}
