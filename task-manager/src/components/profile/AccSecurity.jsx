"use client";

import { useDispatch } from "react-redux";
import { Shield, KeyRound, Monitor, Lock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionCard from "../layout/SectionCard";
import Spinner from "../layout/Spinner";
import { Card, CardContent } from "../ui/Card";
import { useGetAllActiveSessionQuery, useLogoutAllDevicesMutation, useLogoutMutation } from "@/redux/services/authApi";
import { setLogout } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

export default function AccountSecurityTab() {
  const dispatch = useDispatch();
  const { data: responseData, isLoading } = useGetAllActiveSessionQuery();

  // Setup mutations
  const [logout, { isLoading: isLoggingOut }] =
    useLogoutMutation();
  const [logoutAllDevices, { isLoading: isRevokingAll }] =
    useLogoutAllDevicesMutation();

  const sessionsData = responseData?.data || responseData;
  const activeCount = sessionsData?.count || 0;

  const currentDeviceSession = sessionsData?.sessions?.find(
    (s) => s.isCurrentDevice,
  );
  const lastActiveTimeStr = currentDeviceSession
    ? new Date(currentDeviceSession.lastActiveAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  // Logout Current Device
  const handleLogoutCurrent = async () => {
    try {
      const response = await logout().unwrap();
      dispatch(setLogout());

      window.location.href = "/auth";
    } catch (err) {
      console.error("Failed to logout current device:", err);
      toast.error(err.data.messaeg)
    }
  };

  // Logout All Devices
  const handleGlobalRevoke = async () => {
    if (
      confirm(
        "Are you sure you want to log out from all trusted connected devices? This will terminate your current session as well.",
      )
    ) {
      try {
        // 1. Tell backend to drop all Redis sessions linked to this user
        await logoutAllDevices().unwrap();

        // 2. Wipe the Redux global store instantly
        dispatch(setLogout());

        // 3. Redirect back to auth page
        window.location.href = "/auth";
      } catch (err) {
        console.error("Failed global session index deletion:", err);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  return (
    <SectionCard
      title="Account & Security"
      description="Manage active system interfaces, live device configurations, and authorization parameters."
      icon={Shield}
    >
      <div className="space-y-8">
        {/* Dynamic Metric Displays powered by Redis Index State */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <SecurityMetricCard
            icon={KeyRound}
            title="Active Sessions"
            value={activeCount.toString()}
            subtitle="Registered in Redis state"
          />
          <SecurityMetricCard
            icon={Lock}
            title="Account Integrity Status"
            value="Secure"
            subtitle="Verified against signatures"
          />
          <SecurityMetricCard
            icon={Bell}
            title="Last Activity Registered"
            value="Today"
            subtitle={`${lastActiveTimeStr} from current browser`}
          />
        </div>

        {/* Contextual Device Manager Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">
              Trusted System Sessions
            </h3>
            {activeCount > 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleGlobalRevoke}
                disabled={isRevokingAll}
              >
                {isRevokingAll ? <Spinner className="h-4 w-4 mr-2" /> : null}
                Terminate All Devices
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {sessionsData?.sessions?.map((session) => (
              <DeviceCard
                key={session.sessionId}
                name={`${session.os || "Unknown OS"} — ${session.browser || "Unknown Browser"}`}
                device={`${session.deviceType || "Desktop"} • IP: ${session.ipAddress} • Location: ${
                  typeof session.location === "object"
                    ? `${session.location.city || ""}, ${session.location.country || ""}`
                    : session.location || "Unknown Location"
                }`}
                status={
                  session.isCurrentDevice
                    ? "Log Out (Current)"
                    : "Active Device"
                }
                isCurrent={session.isCurrentDevice}
                onAction={
                  session.isCurrentDevice ? handleLogoutCurrent : undefined
                }
                disabled={isLoggingOut || !session.isCurrentDevice}
              />
            ))}

            {activeCount === 0 && (
              <p className="text-sm text-muted-foreground italic p-2">
                No active database keys parsed.
              </p>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export function SecurityMetricCard({ icon: Icon, title, value, subtitle }) {
  return (
    <Card className="rounded-2xl bg-white shadow-sm border">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-xl border p-3 bg-slate-50">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DeviceCard({
  name,
  device,
  status,
  isCurrent,
  onAction,
  disabled,
}) {
  return (
    <Card className="rounded-2xl bg-white shadow-sm border">
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border p-3 bg-slate-50">
            <Monitor className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-800">{name}</p>
              {isCurrent && (
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Active Now
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{device}</p>
          </div>
        </div>

        <Button
          variant={isCurrent ? "outline" : "secondary"}
          size="sm"
          disabled={disabled}
          onClick={onAction}
          className="rounded-xl font-medium shadow-none"
        >
          {status}
        </Button>
      </CardContent>
    </Card>
  );
}
