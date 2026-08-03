import api from "./api";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET ALL PROJECTS
    getAllProjects: builder.query({
      query: ({ orgId, ...queryParams }) => ({
        url: `/projects/${orgId}/`,
        method: "GET",
        params: queryParams,
      }),
      // Labels the list itself AND every individual project inside it
      providesTags: (result) =>
        result?.data?.projects
          ? [
              ...result.data.projects.map(({ _id }) => ({
                type: "Projects",
                id: _id,
              })),
              { type: "Projects", id: "LIST" },
            ]
          : [{ type: "Projects", id: "LIST" }],
    }),

    // 2. GET SINGLE PROJECT BY ID
    getProjectById: builder.query({
      query: ({ orgId, projectId }) => ({
        url: `/projects/${orgId}/${projectId}`,
        method: "GET",
      }),
      // Labels just this specific project
      providesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    // 3. CREATE PROJECT
    projectCreation: builder.mutation({
      query: ({ orgId, ...projectData }) => ({
        url: `/projects/${orgId}/`,
        method: "POST",
        body: projectData,
      }),
      // Invalidates the LIST so the table refetches to show the new project
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),

    // 4. UPDATE PROJECT
    updateProject: builder.mutation({
      query: ({ orgId, projectId, ...projectData }) => ({
        url: `/projects/${orgId}/${projectId}`,
        method: "PATCH",
        body: projectData,
      }),
      // Invalidates the specific project and the list to reflect the updated details
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        { type: "Projects", id: "LIST" },
      ],
    }),

    // 5. ARCHIVE PROJECT
    archiveProject: builder.mutation({
      query: ({ orgId, projectId }) => ({
        url: `/projects/${orgId}/${projectId}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        { type: "Projects", id: "LIST" },
      ],
    }),

    // 6. DELETE PROJECT
    deleteProject: builder.mutation({
      query: ({ orgId, projectId }) => ({
        url: `/projects/${orgId}/${projectId}`,
        method: "DELETE",
      }),
      // Invalidates the specific project (so open tabs close) and removes it from the list
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
        { type: "Projects", id: "LIST" },
      ],
    }),

    // 7. ADD MEMBER TO PROJECT
    addProjectMember: builder.mutation({
      query: ({ orgId, projectId, memberId, roleId }) => ({
        url: `/projects/${orgId}/${projectId}/members`,
        method: "POST",
        body: { memberId, roleId },
      }),
      // Invalidates the project so the members list refetches
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    // 8. REMOVE ALL MEMBERS FROM PROJECT
    removeAllProjectMembers: builder.mutation({
      query: ({ orgId, projectId }) => ({
        url: `/projects/${orgId}/${projectId}/members`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),

    // 9. REMOVE SINGLE MEMBER FROM PROJECT
    removeProjectMember: builder.mutation({
      query: ({ orgId, projectId, memberId }) => ({
        url: `/projects/${orgId}/${projectId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Projects", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useProjectCreationMutation,
  useUpdateProjectMutation,
  useArchiveProjectMutation,
  useDeleteProjectMutation,
  useAddProjectMemberMutation,
  useRemoveAllProjectMembersMutation,
  useRemoveProjectMemberMutation,
} = projectApi;
