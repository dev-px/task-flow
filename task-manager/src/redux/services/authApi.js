import api from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    logoutAllDevices: builder.mutation({
      query: () => ({
        url: "/auth/logout-all-devices",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    getActiveSession: builder.query({
      query: () => ({
        url: "/auth/active-session",
        method: "GET"
      }),
    }),

    getAllActiveSession: builder.query({
      query: () => ({
        url: "/auth/active-all-session",
        method: "GET"
      }),
      providesTags: ["User"]
    }),

  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useLogoutAllDevicesMutation,
  useGetActiveSessionQuery,
  useGetAllActiveSessionQuery
} = authApi;
