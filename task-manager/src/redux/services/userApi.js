import api from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providedTags: ["User"],
    }),

    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: "/users/edit-profile",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;
