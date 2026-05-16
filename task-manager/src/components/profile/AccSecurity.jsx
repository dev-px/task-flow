import { useState } from "react";
import {
  Shield,
  KeyRound,
  Monitor,
  Lock,
  Bell,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SectionCard from "../layout/SectionCard";
import Field from "../layout/Field";
import { Card, CardContent } from "../ui/Card";
import { Label } from "../ui/label";

const accessOptions = ["Admin", "Manager", "Member"];
const securitySections = [
  {
    title: "Login & Authentication",
    fields: [
      "username",
      "registeredEmail",
      "backupEmail",
      "recoveryPhone",
      "changePassword",
      "twoFactorAuth",
    ],
  },
  {
    title: "Access Control",
    fields: [
      "roleBasedAccess",
      "permissionLevel",
      "workspaceAccess",
      "securityAlerts",
    ],
  },
];
const permissionOptions = ["Full Access", "Limited Access", "Read Only"];
const workspaceOptions = ["Engineering", "Product", "Marketing", "HR"];

export default function AccountSecurityTab() {
  const [securityData, setSecurityData] = useState({
    activeSessions: 3,
    failedLoginAttempts: 2,
    lastLoginTime: "Today • 10:42 AM",
    loginHistory: [
      { device: "Chrome", location: "Varanasi", status: "Success" },
      { device: "Safari", location: "Delhi", status: "Success" },
    ],
    recentSecurityActivity: [
      "Password changed 2 days ago",
      "New device login detected",
    ],
    username: "johndoe",
    registeredEmail: "john@example.com",
    backupEmail: "backup@example.com",
    recoveryPhone: "+91 9876543210",
    changePassword: "",
    roleBasedAccess: "Manager",
    permissionLevel: "Full Access",
    workspaceAccess: "Engineering",
    twoFactorAuth: true,
    securityAlerts: true,
  });

  const updateField = (field, value) => {
    setSecurityData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <SectionCard
      title="Account & Security"
      description="Manage authentication, access control, and security settings."
      icon={Shield}
    >
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <SecurityMetricCard
            icon={KeyRound}
            title="Active Sessions"
            value="3"
            subtitle="Across trusted devices"
          />
          <SecurityMetricCard
            icon={Lock}
            title="Failed Login Attempts"
            value="2"
            subtitle="Last 7 days"
          />
          <SecurityMetricCard
            icon={Bell}
            title="Last Login"
            value="Today"
            subtitle="10:42 AM from Chrome"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Username">
            <Input
              value={securityData.username}
              onChange={(e) => updateField("username", e.target.value)}
            />
          </Field>

          <Field label="Registered Email">
            <Input
              type="email"
              value={securityData.registeredEmail}
              onChange={(e) => updateField("registeredEmail", e.target.value)}
            />
          </Field>

          <Field label="Backup Email">
            <Input
              type="email"
              value={securityData.backupEmail}
              onChange={(e) => updateField("backupEmail", e.target.value)}
            />
          </Field>

          <Field label="Recovery Phone Number">
            <Input
              value={securityData.recoveryPhone}
              onChange={(e) => updateField("recoveryPhone", e.target.value)}
            />
          </Field>

          <Field label="Change Password">
            <Input
              type="password"
              placeholder="Enter new password"
              value={securityData.changePassword}
              onChange={(e) => updateField("changePassword", e.target.value)}
            />
          </Field>

          <Field label="Role-Based Access">
            <Select
              value={securityData.roleBasedAccess}
              onValueChange={(value) => updateField("roleBasedAccess", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {accessOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Permission Level">
            <Select
              value={securityData.permissionLevel}
              onValueChange={(value) => updateField("permissionLevel", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                {permissionOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Workspace Access">
            <Select
              value={securityData.workspaceAccess}
              onValueChange={(value) => updateField("workspaceAccess", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaceOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
            </div>
            <Switch
              checked={securityData.twoFactorAuth}
              onCheckedChange={(value) => updateField("twoFactorAuth", value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Label>Security Alerts</Label>
            </div>
            <Switch
              checked={securityData.securityAlerts}
              onCheckedChange={(value) => updateField("securityAlerts", value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Login History</h3>
          <div className="rounded-2xl border p-4 space-y-3">
            {securityData.loginHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-3 last:border-none last:pb-0"
              >
                <div>
                  <p className="font-medium">{item.device}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.location}
                  </p>
                </div>
                <p className="text-sm">{item.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Security Activity</h3>
          <div className="rounded-2xl border p-4 space-y-3">
            {securityData.recentSecurityActivity.map((item, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                • {item}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Trusted Devices</h3>

          <div className="grid gap-4">
            <DeviceCard
              name="MacBook Pro"
              device="Chrome • Varanasi, India"
              status="Trusted"
            />
            <DeviceCard
              name="iPhone 15"
              device="Safari • Mobile Session"
              status="Active"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export function SecurityMetricCard({ icon: Icon, title, value, subtitle }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-xl border p-3">
            <Icon className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-xl font-semibold">{value}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DeviceCard({ name, device, status }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border p-3">
            <Monitor className="h-5 w-5" />
          </div>

          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{device}</p>
          </div>
        </div>

        <Button variant="outline" size="sm">
          {status}
        </Button>
      </CardContent>
    </Card>
  );
}
