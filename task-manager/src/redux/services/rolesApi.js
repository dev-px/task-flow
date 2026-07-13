import api from "./api";

export const rolesApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // 1. GET /:orgId/roles
        getAllRoles: builder.query({
            query: ({ orgId, queryParams }) => ({
                url: `/roles/${orgId}`,
                method: "GET",
                params: queryParams
            }),
            providesTags: (result) =>
                // Provides the "Roles" list tag to the cache
                result
                    ? [
                        ...result?.data?.map(({ _id }) => ({ type: 'Roles', id: _id })),
                        { type: 'Roles', id: 'LIST' },
                    ]
                    : [{ type: 'Roles', id: 'LIST' }],
        }),

        // 2. POST /:orgId/roles
        createRole: builder.mutation({
            query: ({ orgId, data }) => ({
                url: `/roles/${orgId}`,
                method: "POST",
                body: data, // Passes the roleSchema data
            }),
            // Invalidates the list so getAllRoles refetches automatically
            invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
        }),

        // 3. PATCH /:orgId/roles/:roleId
        editRole: builder.mutation({
            query: ({ orgId, roleId, data }) => ({
                url: `/roles/${orgId}/${roleId}`,
                method: "PATCH",
                body: data, // Passes the editRoleSchema data
            }),
            // Invalidates the specific role and the list
            invalidatesTags: (result, error, { roleId }) => [
                { type: 'Roles', id: roleId },
                { type: 'Roles', id: 'LIST' }
            ],
        }),

        // 4. PATCH /:orgId/roles/:roleId/delete
        archiveRole: builder.mutation({
            query: ({ orgId, roleId, description }) => ({
                url: `/roles/${orgId}/${roleId}/delete`,
                method: "PATCH",
                body: { description }
            }),
            // Invalidates the specific role and the list
            invalidatesTags: (result, error, { roleId }) => [
                { type: 'Roles', id: roleId },
                { type: 'Roles', id: 'LIST' }
            ],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetAllRolesQuery,
    useCreateRoleMutation,
    useEditRoleMutation,
    useArchiveRoleMutation
} = rolesApi;