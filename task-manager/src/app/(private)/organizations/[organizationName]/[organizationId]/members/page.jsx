"use client";

import { useState, useEffect } from "react";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";
import { MoreHorizontal, Trash, Ban, Mail, Edit2Icon } from "lucide-react";
import InviteMemberModal from "@/components/member/InviteMemberModal";
import {
  useGetAllMembersQuery,
  useGetOneMemberQuery,
} from "@/redux/services/memberApi";
import { useParams } from "next/navigation";
import usePermissions from "@/hooks/usePermissions";

const initialMemberFilterState = {
  search: "",
  status: "",
  isDeleted: "false",
  limit: 10,
  sortBy: "newest",
};

export default function MemberPage() {
  const {hasPermissions} = usePermissions();
  const [filters, setFilters] = useState(initialMemberFilterState);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const params = useParams();
  const { organizationId } = params;

  const {
    data,
    isLoading: isMemberLoading,
    isError: memeberLoadingError,
  } = useGetAllMembersQuery({
    orgId: organizationId,
    ...filters,
  });
  // const [
  //   getOneMember,
  //   { isLoading: isOneMemberLoading, isError: oneMemeberLoadingError },
  // ] = useGetOneMemberQuery(organizationId, { skip: !organizationId });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const memberData = data?.data?.members;

  return (
    <div className="p-3 bg-white w-full">
      <ProjectHeader
        pTitle="Organization Members"
        pDescription="Manage roles, permissions, and team invites."
        type="members"
        setShowInviteModal={setShowInviteModal}
      />

      <ProjectFilters
        page="members"
        filters={filters}
        setFilters={setFilters}
        onClearFilter={() => setFilters(initialMemberFilterState)}
      />

      <div className="w-full overflow-x-auto mt-4 rounded-lg border border-gray-200">
        <table className="w-full text-sm border-collapse">
          <thead className="text-left border-b bg-gray-100">
            <tr>
              <th className="py-3 px-4 font-semibold">Member</th>
              <th className="py-3 px-4 font-semibold">Role</th>
              <th className="py-3 px-4 font-semibold hidden sm:table-cell">
                Designation
              </th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold hidden md:table-cell">
                Date
              </th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {memberData?.map((member) => (
              <tr key={member._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4">
                  {member.user ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {member.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {member.user.email}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-medium italic text-gray-500">
                        Pending Invite
                      </span>
                      <span className="text-xs text-gray-500">
                        {member.inviteEmail}
                      </span>
                    </div>
                  )}
                </td>

                <td className="px-4 py-4">
                  <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                    {member.role.name}
                  </span>
                </td>

                <td className="px-4 py-4 text-gray-600 hidden sm:table-cell truncate max-w-[150px]">
                  {member.designation || "—"}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      member.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-gray-500 hidden md:table-cell text-xs">
                  {member.status === "active"
                    ? formatDate(member.joinedAt)
                    : formatDate(member.invitedAt)}
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <button
                      className="hover:text-black transition"
                      title="Edit Member"
                    >
                      <Edit2Icon size={18} />
                    </button>
                    {member.status === "invited" ? (
                      <button
                        className="hover:text-black transition cursor-pointer"
                        title="Resend Invite"
                      >
                        <Mail size={18} />
                      </button>
                    ) : (
                      <button
                        className="hover:text-black transition"
                        title="Suspend Member"
                      >
                        <Ban size={18} />
                      </button>
                    )}
                    <button
                      className="hover:text-red-600 transition cursor-pointer"
                      title="Delete Member"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {memberData?.length === 0 && (
          <div className="p-8 text-center text-gray-500">No members found.</div>
        )}
      </div>

      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          orgId={organizationId}
        />
      )}
    </div>
  );
}
