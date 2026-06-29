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
        params, // Query params (verifyInviteQuerySchema)
        body, // Body payload (acceptInviteBodySchema)
      }),
      // Invalidates the list so the new member appears immediately
      invalidatesTags: ["Members"],
    }),

    // 3. Get All Members (GET /:orgId)
    getAllMembers: builder.query({
      query: ({ orgId, ...params }) => ({
        url: `/members/${orgId}`,
        method: "GET",
        params,
      }),
      providesTags: ["Members"],
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
      invalidatesTags: ["Members"],
    }),

    // 6. Bulk Invite (POST /:orgId/invite/bulk)
    bulkInvite: builder.mutation({
      query: ({ orgId, body }) => ({
        url: `/members/${orgId}/invite/bulk`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Members"],
    }),

    // 7. Reinvite Member (POST /:orgId/invite/:invitedmemberId/reinvite)
    reinviteMember: builder.mutation({
      query: ({ orgId, invitedmemberId }) => ({
        url: `/members/${orgId}/invite/${invitedmemberId}/reinvite`,
        method: "POST",
      }),
    }),

    // 8. Cancel Invite (POST /:orgId/invite/:invitedmemberId/cancel)
    cancelInvite: builder.mutation({
      query: ({ orgId, invitedmemberId }) => ({
        url: `/members/${orgId}/invite/${invitedmemberId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Members"],
    }),

    // 9. Suspend Member (PATCH /:orgId/:invitedmemberId/suspend)
    suspendMember: builder.mutation({
      query: ({ orgId, invitedmemberId, body }) => ({
        url: `/members/${orgId}/${invitedmemberId}/suspend`,
        method: "PATCH",
        body,
      }),
      // Invalidates both the main list and the specific cached member
      invalidatesTags: (result, error, { invitedmemberId }) => [
        "Members",
        { type: "Members", id: invitedmemberId },
      ],
    }),

    // 10. Delete/Archive Member (DELETE /:orgId/:invitedmemberId/delete)
    deleteMember: builder.mutation({
      query: ({ orgId, invitedmemberId }) => ({
        url: `/members/${orgId}/${invitedmemberId}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Members"],
    }),
  }),
  overrideExisting: false,
});

// Export the auto-generated hooks for use in your React components
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
  useDeleteMemberMutation,
} = memberApi;
