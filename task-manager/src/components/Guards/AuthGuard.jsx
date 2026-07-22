"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { setCredentials, setLogout } from "@/redux/slices/authSlice";
import Spinner from "../layout/Spinner";

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname(); // Helpful for redirecting back after login
  const token = useSelector((state) => state.auth.token);

  // Use a State Machine instead of multiple confusing booleans
  const [authStatus, setAuthStatus] = useState("CHECKING"); // 'CHECKING' | 'AUTHENTICATED' | 'UNAUTHENTICATED'
  const hasAttemptedRefresh = useRef(false);

  // 1. Verify Authentication Status
  useEffect(() => {
    const verifySession = async () => {
      // If we already have a token in Redux, they are authenticated
      if (token) {
        setAuthStatus("AUTHENTICATED");
        return;
      }

      // If we don't have a token, attempt to restore the session from the HTTP-Only cookie
      if (!hasAttemptedRefresh.current) {
        hasAttemptedRefresh.current = true;

        // Use AbortController to prevent infinite loading if the backend goes down
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

        try {
          // Use an Environment Variable for the API URL in production
          const API_URL = "http://localhost:5000/api/v1";

          const response = await fetch(`${API_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const result = await response.json();
            const accessToken = result.data?.accessToken;
            const user = result.data?.user;
            if (accessToken) {
              dispatch(setCredentials({ token: accessToken, user }));
              setAuthStatus("AUTHENTICATED");
              return;
            }
          }

          // If we reach here, the response wasn't OK or didn't contain a token
          throw new Error("Invalid session");
        } catch (error) {
          console.warn("[AuthGuard] Session restore failed:", error.message);
          dispatch(setLogout());
          setAuthStatus("UNAUTHENTICATED");
        }
      } else {
        // If we already attempted refresh and still have no token, they are unauthenticated
        setAuthStatus("UNAUTHENTICATED");
      }
    };

    verifySession();
  }, [token, dispatch]);

  // 2. Handle Redirection Safely
  useEffect(() => {
    if (authStatus === "UNAUTHENTICATED") {
      // Optional Pro-Tip: Pass the current URL so they return here after logging in
      // e.g., router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
      router.replace("/auth");
    }
  }, [authStatus, router]);

  // 3. Render Logic
  if (authStatus === "CHECKING") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50/50">
        <Spinner text="Verifying session..." />
      </div>
    );
  }

  if (authStatus === "UNAUTHENTICATED") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50/50">
        <Spinner text="Redirecting to secure login..." />
      </div>
    );
  }

  // If AUTHENTICATED, render the private children
  return <>{children}</>;
};

export default AuthGuard;
