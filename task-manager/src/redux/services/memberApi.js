import api from "./api";

export const memberApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // 1. Verify Invite (GET /verify-invite)
    verifyInvite: builder.query({
      query: (params) => ({
        url: `/members/verify-invite`,
        method: "GET",
        params,
      }),
    }),

    // 2. Accept Invite (POST /accept-invite)
    acceptInvite: builder.mutation({
      query: ({ params, body }) => ({
        url: `/members/accept-invite`,
        method: "POST",
        params,
        body,
      }),
      // Invalidates the list so the new member appears immediately
      invalidatesTags: [{ type: "Members", id: "LIST" }],
    }),

    // 3. Get All Members (GET /:orgId)
    getAllMembers: builder.query({
      query: ({ orgId, ...params }) => ({
        url: `/members/${orgId}`,
        method: "GET",
        params,
      }),
      // Labels the list itself AND every individual member inside it
      providesTags: (result) =>
        result
          ? [
            ...result.data.members.map(({ _id }) => ({ type: "Members", id: _id })),
            { type: "Members", id: "LIST" },
          ]
          : [{ type: "Members", id: "LIST" }],
    }),

    // 4. Get Single Member by ID (GET /:orgId/:invitedmemberId)
    getOneMember: builder.query({
      query: ({ orgId, invitedmemberId, ...params }) => ({
        url: `/members/${orgId}/${invitedmemberId}`,
        method: "GET",
        params,
      }),
      // Tags this specific member for targeted cache invalidation
      providesTags: (result, error, { invitedmemberId }) => [
        { type: "Members", id: invitedmemberId },
      ],
    }),

    // 5. Invite Single Member (POST /:orgId/invite/single)
    inviteSingleMember: builder.mutation({
      query: ({ orgId, body }) => ({
        url: `/members/${orgId}/invite/single`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Members", id: "LIST" }],
    }),

    // 6. Bulk Invite (POST /:orgId/invite/bulk)
    bulkInvite: builder.mutation({
      query: ({ orgId, ...excelData }) => ({
        url: `/members/${orgId}/invite/bulk`,
        method: "POST",
        body: excelData,
      }),
      invalidatesTags: [{ type: "Members", id: "LIST" }],
    }),

    // 7. Reinvite Member (POST /:orgId/invite/:invitedmemberId/reinvite)
    reinviteMember: builder.mutation({
      query: ({ orgId, invitedmemberId }) => ({
        url: `/members/${orgId}/invite/${invitedmemberId}/reinvite`,
        method: "POST",
      }),
      // Reinviting changes their status, so invalidate this user and the list
      invalidatesTags: (result, error, { invitedmemberId }) => [
        { type: "Members", id: invitedmemberId },
        { type: "Members", id: "LIST" },
      ],
    }),

    // 8. Cancel Invite (POST /:orgId/invite/:invitedmemberId/cancel)
    cancelInvite: builder.mutation({
      query: ({ orgId, invitedmemberId }) => ({
        url: `/members/${orgId}/invite/${invitedmemberId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { invitedmemberId }) => [
        { type: "Members", id: invitedmemberId },
        { type: "Members", id: "LIST" },
      ],
    }),

    // 9. Suspend Member (PATCH /:orgId/:invitedmemberId/suspend)
    suspendMember: builder.mutation({
      query: ({ orgId, invitedmemberId, body }) => ({
        url: `/members/${orgId}/${invitedmemberId}/suspend`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { invitedmemberId }) => [
        { type: "Members", id: invitedmemberId },
        { type: "Members", id: "LIST" },
      ],
    }),

    // 10. Patch/Edit Member (DELETE /:orgId/:invitedmemberId/editMember)
    editMember: builder.mutation({
      query: ({ orgId, invitedmemberId, body }) => ({
        url: `/members/${orgId}/${invitedmemberId}/editMember`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { invitedmemberId }) => [
        { type: "Members", id: invitedmemberId },
        { type: "Members", id: "LIST" },
      ],
    }),

    // 11. Delete/Archive Member (DELETE /:orgId/:invitedmemberId/delete)
    deleteMember: builder.mutation({
      query: ({ orgId, invitedmemberId }) => ({
        url: `/members/${orgId}/${invitedmemberId}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { invitedmemberId }) => [
        { type: "Members", id: invitedmemberId },
        { type: "Members", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useVerifyInviteQuery,
  useAcceptInviteMutation,
  useGetAllMembersQuery,
  useGetOneMemberQuery,
  useInviteSingleMemberMutation,
  useBulkInviteMutation,
  useReinviteMemberMutation,
  useCancelInviteMutation,
  useSuspendMemberMutation,
  useEditMemberMutation,
  useDeleteMemberMutation,
} = memberApi;