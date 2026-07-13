"use client";

import { useState, useEffect } from "react";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";
import { MoreHorizontal, Trash, Ban, Mail, Edit2Icon, MailX } from "lucide-react";
import InviteMemberModal from "@/components/member/InviteMemberModal";
import {
  useCancelInviteMutation,
  useDeleteMemberMutation,
  useGetAllMembersQuery,
  useReinviteMemberMutation,
  useSuspendMemberMutation,
} from "@/redux/services/memberApi";
import { useParams } from "next/navigation";
import usePermissions from "@/hooks/usePermissions";
import toast from "react-hot-toast";
import EditMemberModal from "@/components/member/EditMemberModal";
import { initialMemberFilterState } from "@/utils/constant";
import Spinner from "@/components/layout/Spinner";

const TABLE_HEADER = [
  "Member",
  "Role",
  "Designation",
  "Status",
  "Date of Joining",
  "Actions",
];

export default function MemberPage() {
  const { hasPermission } = usePermissions();
  const [filters, setFilters] = useState(initialMemberFilterState);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState({});
  const params = useParams();
  const { organizationId } = params;

  const {
    data,
    isLoading: isMemberLoading,
    isError: memeberLoadingError,
  } = useGetAllMembersQuery({
    orgId: organizationId,
    ...filters,
  }, { skip: (!hasPermission("member:read") || !organizationId) });
  const [deleteMember, { isLoading: isDelMemberLoading }] =
    useDeleteMemberMutation();
  const [suspendMember, { isLoading: isSuspendedMemberLoading }] =
    useSuspendMemberMutation();
  const [reinviteMember, { isLoading: isReinviteMemberLoading }] =
    useReinviteMemberMutation();
  const [cancelInvite, { isLoading: isLoadingInviteCancel }] =
    useCancelInviteMutation()


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  // ---- DELETE HANDLERS ----
  const handleMemberDelete = async (memberId) => {
    try {
      const response = await deleteMember({
        orgId: organizationId,
        invitedmemberId: memberId,
      }).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  // ---- SUSPEND HANDLERS ----
  const handleSuspendMember = async (memberId) => {
    try {
      const response = await suspendMember({
        orgId: organizationId,
        invitedmemberId: memberId,
      }).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  // ---- RE-INVITE HANDLERS ----
  const handleReInvite = async (memberId) => {
    try {
      const response = await reinviteMember({
        orgId: organizationId,
        invitedmemberId: memberId
      }).unwrap();
      console.log(response)
      toast.success(response.message);
    } catch (error) {
      toast.error(error.data.message);
    }
  }

  // ---- CANCEL INVITE HANDLERS ----
  const handleCancelInvite = async (memberId) => {
    try {
      const response = await cancelInvite({
        orgId: organizationId,
        invitedmemberId: memberId
      }).unwrap();
      console.log(response)
      toast.success(response.message);
    } catch (error) {
      toast.error(error.data.message);
    }
  }

  const handleEditMemberDialog = (member) => {
    setShowEditModal(true);
    setSelectedMember(member);
  };

  const memberData = data?.data?.members;

  return (
    <div className="p-3 bg-white w-full">
      <ProjectHeader
        pTitle="Organization Members"
        pDescription="Manage your organization's members"
        type="members"
        setShowInviteModal={setShowInviteModal}
        hasPermission={hasPermission}
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
              {TABLE_HEADER.map((header) => (
                <th key={header} className="py-3 px-4 font-semibold">
                  {header}
                </th>
              ))}
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
                    className={`px-2 py-1 rounded text-xs font-medium capitalize ${member.status === "active"
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
                  <div className="flex items-center justify-start gap-6 text-gray-400">
                    {hasPermission("member:edit") && (
                      <button
                        className="hover:text-black transition cursor-pointer"
                        title="Edit Member"
                        onClick={() => handleEditMemberDialog(member)}
                      >
                        <Edit2Icon size={18} />
                      </button>
                    )}
                    {member.status === "invited" ? (
                      <>
                        {hasPermission("member:create") && (
                          <>
                            <button
                              className="hover:text-black transition cursor-pointer"
                              title="Resend Invite"
                              onClick={() => handleReInvite(member._id)}
                            >
                              <Mail size={18} />
                            </button>
                            <button
                              className="hover:text-black transition cursor-pointer"
                              title="Cancel Invite"
                              onClick={() => handleCancelInvite(member._id)}
                            >
                              <MailX size={18} />
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {hasPermission("member:revoked") && (
                          <button
                            className="hover:text-black transition cursor-pointer"
                            title="Suspend Member"
                            onClick={() => handleSuspendMember(member._id)}
                            disabled={isSuspendedMemberLoading}
                          >
                            <Ban size={18} />
                          </button>
                        )}
                        {hasPermission("member:delete") && (
                          <button
                            className="hover:text-red-600 transition cursor-pointer"
                            title="Delete Member"
                            onClick={() => handleMemberDelete(member._id)}
                            disabled={isDelMemberLoading}
                          >
                            <Trash size={18} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {memberData?.length === 0 && memeberLoadingError && (
          <div className="p-8 text-center text-gray-500">Something went wrong. Please try again!</div>
        )}

        {memberData?.length === 0 && (
          <div className="p-8 text-center text-gray-500">No members found.</div>
        )}

        {isMemberLoading && <Spinner text="Member details loading..." />}
      </div>

      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          orgId={organizationId}
        />
      )}

      {showEditModal && (
        <EditMemberModal
          onClose={() => setShowEditModal(false)}
          memberData={selectedMember}
        />
      )}
    </div>
  );
}
