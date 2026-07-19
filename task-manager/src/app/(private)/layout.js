"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/Guards/AuthGuard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { connectSocket, disconnectSocket } from "@/redux/slices/socketSlice";

export default function PrivateLayout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    console.log("socket checking")
    if (user?._id) {
      console.log("going to socket")
      dispatch(connectSocket());
    }

    return () => dispatch(disconnectSocket());
  }, [dispatch, user]);

  return (
    <ProtectedRoute>
      <TooltipProvider>
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 h-full">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </TooltipProvider>
    </ProtectedRoute>
  );
}
