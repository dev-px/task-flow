import ProtectedRoute from "@/components/Guards/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function PrivateLayout({ children }) {
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
