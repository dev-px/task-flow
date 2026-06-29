import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, setLogout } from "../slices/authSlice";
import { Mutex } from "async-mutex";
import toast from "react-hot-toast";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, the token is expired or missing
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // 1. Attempt to refresh the token
        const refreshResult = await baseQuery(
          { url: "/auth/refresh-token", method: "POST" },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          // Check if we already have a user in Redux
          let currentUser = api.getState().auth.user;
          const newToken = refreshResult.data.accessToken;

          // 2. If Redux lost the user (e.g., hard refresh), fetch them now!
          if (!currentUser) {
            const meResult = await baseQuery(
              { url: "/auth/me", method: "GET" },
              api,
              extraOptions,
            );
            if (meResult.data) {
              currentUser = meResult.data;
            } else {
              toast.error("Failed to fetch user profile");
            }
          }

          // 3. Save the new token and user to Redux
          api.dispatch(
            setCredentials({
              user: currentUser,
              token: newToken,
            }),
          );

          // 4. Retry the original query that failed
          result = await baseQuery(args, api, extraOptions);
        } else {
          // If refresh fails, throw an error to trigger the catch block
          toast.error("Refresh token expired or invalid");
        }
      } catch (error) {
        // 5. IF REFRESH FAILS: Call the backend logout API
        await baseQuery(
          { url: "/auth/logout", method: "POST" },
          api,
          extraOptions,
        );

        // 6. Wipe frontend Redux auth state
        api.dispatch(setLogout());

        // 7. Wipe all cached RTK Query data to prevent data leaks
        api.dispatch(api.util.resetApiState());
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Organizations",
    "Members",
    "Roles",
    "Project",
    "Task",
  ],
  endpoints: () => ({}),
});

export default api;
