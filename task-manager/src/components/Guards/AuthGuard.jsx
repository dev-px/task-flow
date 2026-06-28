"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCredentials, setLogout } from "@/redux/slices/authSlice";
import Spinner from "../layout/Spinner";

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(!token);
  const hasAttemptedRefresh = useRef(false);

  // 1. Handle Hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Handle Silent Refresh (Hydrating Redux from Cookie)
  useEffect(() => {
    const restoreSession = async () => {
      // Edge Case: Prevent double-fetching in React 18 development mode
      if (hasAttemptedRefresh.current) return;
      hasAttemptedRefresh.current = true;

      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/auth/refresh-token",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (response.ok) {
          const result = await response.json();
          const accessToken = result.data?.accessToken || result.accessToken;
          const user = result.data?.user || result.user;

          dispatch(setCredentials({ token: accessToken, user }));
        } else {
          dispatch(setLogout());
        }
      } catch (error) {
        console.error("Session restore failed:", error);
        dispatch(setLogout());
      } finally {
        setIsLoading(false);
      }
    };

    if (!token) {
      restoreSession();
    } else {
      setIsLoading(false);
    }
  }, [token, dispatch]);

  // 3. Handle Redirection if Auth Fails
  useEffect(() => {
    if (isMounted && !isLoading && !token) {
      router.replace("/auth");
    }
  }, [isMounted, isLoading, token, router]);

  if (!isMounted || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Spinner text="loading..." />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Spinner text="Redirecting to login..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
