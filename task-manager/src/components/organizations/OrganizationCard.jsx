"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/Card";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useOrgDeleteMutation } from "@/redux/services/orgApi";

export default function OrganizationCard({ org, onEdit }) {
  const router = useRouter();
  const [
    orgDelete,
    { isLoading: isOrgDeletionLoading, isError: orgDeletionError },
  ] = useOrgDeleteMutation();

  const handleOrgDelete = async (orgId) => {
    try {
      const orgDeleteData = await orgDelete(orgId).unwrap();
      console.log("Deleted successfully:", orgDeleteData);
    } catch (error) {
      console.error("Failed to delete organization:", error);
    }
  };

  return (
    <Card className="w-full relative">
      <CardContent className="pt-6">
        {/* Header with name + menu */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold truncate pr-4">{org?.name}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0">
                <MoreVertical size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Calls the parent's handleEditOrganization function */}
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleOrgDelete(org._id)}
                disabled={isOrgDeletionLoading}
              >
                {isOrgDeletionLoading ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {org?.description}
        </p>
      </CardContent>
    </Card>
  );
}
