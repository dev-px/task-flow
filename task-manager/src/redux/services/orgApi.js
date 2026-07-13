import api from "./api";

export const orgApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL
    getAllOrganizations: builder.query({
      query: (queryParams) => ({
        url: "/organizations",
        method: "GET",
        params: queryParams,
      }),
      // Labels the list itself AND every individual org inside it
      providesTags: (result) =>
        result
          ? [
            ...result?.data?.map(({ organization }) => ({ type: "Organizations", _id: organization._id })),
            { type: "Organizations", id: "LIST" },
          ]
          : [{ type: "Organizations", id: "LIST" }],
    }),

    // GET ONE
    getOneOrganization: builder.query({
      query: (orgId) => ({
        url: `/organizations/${orgId}`,
        method: "GET",
      }),
      // Labels just this specific org
      providesTags: (result, error, orgId) => [{ type: "Organizations", id: orgId }],
    }),

    // CREATE
    orgCreation: builder.mutation({
      query: (orgData) => ({
        url: "/organizations/",
        method: "POST",
        body: orgData,
      }),
      // Only invalidates the LIST, so the table refetches to show the new org
      invalidatesTags: [{ type: "Organizations", id: "LIST" }],
    }),

    // EDIT
    orgEdit: builder.mutation({
      query: ({ orgId, ...orgData }) => ({
        url: `/organizations/${orgId}`,
        method: "PATCH",
        body: orgData,
      }),
      // Invalidates the specific org we edited, the LIST, and the User cache
      invalidatesTags: (result, error, { orgId }) => [
        { type: "Organizations", id: orgId },
        { type: "Organizations", id: "LIST" },
        "User" // Assuming User is a global tag you want to wipe on org edits
      ],
    }),

    // DELETE
    orgDelete: builder.mutation({
      query: (orgId) => ({
        url: `/organizations/${orgId}`,
        method: "DELETE",
      }),
      // Invalidates the specific org we deleted, the LIST, and the User cache
      invalidatesTags: (result, error, orgId) => [
        { type: "Organizations", id: orgId },
        { type: "Organizations", id: "LIST" },
        "User"
      ],
    }),

  }),
});

export const {
  useOrgCreationMutation,
  useOrgEditMutation,
  useOrgDeleteMutation,
  useGetAllOrganizationsQuery,
  useGetOneOrganizationQuery,
} = orgApi;