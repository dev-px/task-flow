import { Pencil, Plus, PlusSquare, Settings, Users } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function ProjectHeader({
  pTitle,
  pDescription,
  type,
  setShowModal,
  setShowTaskModal,
  setShowManageMembersModal,
  projectId,
}) {
  const Icon = type === "create" ? Plus : Pencil;
  const router = useRouter();

  return (
    <div className="flex justify-between items-center flex-col md:flex-row">
      <div className="flex flex-col gap-2 mb-4 self-start md:mb-0">
        <h1 className="font-bold text-xl">{pTitle}</h1>
        <p className="text-gray-500">{pDescription}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-between sm:justify-end w-full md:w-auto">
        <Button
          size="lg"
          className="flex-1 rounded-sm hover:bg-gray-800 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <Icon size={18} />
          {type === "create" ? (
            <span className="hidden md:block">Create Project</span>
          ) : (
            <span className="hidden md:block">Edit Project</span>
          )}
        </Button>

        {type === "edit" && (
          <>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-sm cursor-pointer"
              onClick={() => setShowTaskModal(true)}
            >
              <PlusSquare size={18} />
              <span className="hidden md:block">Add Task</span>
            </Button>
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
              onClick={() => router.push(`/projects/${projectId}/settings`)}
            >
              <Settings size={18} />
              <span className="hidden md:block">Settings</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
