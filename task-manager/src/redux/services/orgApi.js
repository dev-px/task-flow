import api from "./api";

export const orgApi = api.injectEndpoints({
  endpoints: (builder) => ({
    orgCreation: builder.mutation({
      query: (orgData) => ({
        url: "/organizations/",
        method: "POST",
        body: orgData,
      }),
      providesTags: ["Organizations"],
    }),

    orgEdit: builder.mutation({
      query: ({orgId, ...orgData}) => ({
        url: `/organizations/${orgId}`,
        method: "PATCH",
        body: orgData,
      }),
      invalidatesTags: ["Organizations", "User"],
    }),

    orgDelete: builder.mutation({
      query: (orgId) => ({
        url: `/organizations/${orgId}`,
        method: "DELETE",
      }),
      providesTags: ["Organizations", "User"],
    }),

    getAllOrganizations: builder.query({
      query: (queryParams) => ({
        url: "/organizations",
        method: "GET",
        params: queryParams,
      }),
      providesTags: ["Organizations"],
    }),

    getOneOrganization: builder.query({
      query: (orgId) => ({
        url: `/organizations/${orgId}`,
        method: "GET",
      }),
      providesTags: ["Organizations"],
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
