"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  Users,
  ShieldCheck,
  CheckSquare,
  Activity,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import usePermissions from "@/hooks/usePermissions";

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const { hasPermission, isLoading } = usePermissions();
  const orgName = params?.organizationName;
  const orgId = params?.organizationId;
  const baseUrl = orgName && orgId ? `/organizations/${orgName}/${orgId}` : "";

  const topLinks = [
    {
      name: "Organizations",
      href: "/organizations",
      icon: Building2,
      permit: "org:read",
      alwaysShow: true,
    },
    {
      name: "Projects",
      href: `${baseUrl}/projects`,
      icon: FolderKanban,
      permit: "project:read",
    },
    {
      name: "Tasks",
      href: `${baseUrl}/mytasks`,
      icon: CheckSquare,
      permit: "task:read",
    },
    {
      name: "Members",
      href: `${baseUrl}/members`,
      icon: Users,
      permit: "member:read",
    },
    {
      name: "Activities",
      href: `${baseUrl}/activity`,
      icon: Activity,
      permit: "activity:read",
    },
    {
      name: "Roles",
      href: `${baseUrl}/roles`,
      icon: ShieldCheck,
      permit: "role:read",
    },
  ];

  const bottomLinks = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Logout", href: "/logout", icon: LogOut },
  ];

  const isActive = (href) => {
    if (href === "/organizations") return pathname === "/organizations";
    return pathname.startsWith(href);
  };

  const linkStyle = (href) =>
    `flex items-center justify-center p-2 rounded-lg transition w-10 mx-auto
     ${
       isActive(href)
         ? "bg-gray-100 text-black"
         : "text-gray-500 hover:bg-gray-100 hover:text-black"
     }`;

  return (
    <aside className="h-screen w-16 border-r flex flex-col py-4">
      {/* Logo */}
      <Link href="/" className="decoration-0 flex justify-center">
        <div className="font-bold text-lg mb-8 tracking-wider">TF</div>
      </Link>

      {/* Top Links */}
      <nav className="flex flex-col gap-3 flex-1 w-full">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="flex items-center justify-center p-2 w-10 mx-auto"
              >
                <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
              </div>
            ))
          : topLinks.map((link) => {
              const Icon = link.icon;
              const isPermit = hasPermission(link.permit);

              // Only render organization-specific links if we are actually inside an organization route
              const shouldRender = link.alwaysShow || (baseUrl && isPermit);

              return (
                shouldRender && (
                  <Tooltip key={link.name}>
                    <TooltipTrigger
                      asChild
                      className="w-full flex justify-center"
                    >
                      <Link href={link.href} className={linkStyle(link.href)}>
                        <Icon size={20} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{link.name}</TooltipContent>
                  </Tooltip>
                )
              );
            })}
      </nav>

      {/* Bottom Links */}
      <nav className="flex flex-col gap-3 w-full">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Tooltip key={link.name}>
              <TooltipTrigger asChild className="w-full flex justify-center">
                <Link href={link.href} className={linkStyle(link.href)}>
                  <Icon size={20} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.name}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
}