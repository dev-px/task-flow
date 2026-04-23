"use client";

import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Bell, Save } from "lucide-react";
import { Button } from "../ui/button";
import SectionCard from "../layout/SectionCard";

export default function NotificationSettingTab() {
  const notificationLabels = {
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    desktopNotifications: "Desktop Notifications",
    taskAssignedAlerts: "Task Assignment Alerts",
    taskStatusUpdates: "Task Status Updates",
    dueDateReminders: "Due Date Reminders",
    overdueTaskAlerts: "Overdue Task Alerts",
    mentionsAndComments: "Mentions & Comments",
    projectUpdates: "Project Updates",
    weeklySummary: "Weekly Productivity Summary",
    monthlyReports: "Monthly Performance Reports",
    approvalRequests: "Approval Requests",
    securityAlerts: "Security Alerts",
    billingAlerts: "Billing & Subscription Alerts",
    systemAnnouncements: "System Announcements",
  };

  const notificationDescriptions = {
    emailNotifications:
      "Enable alerts via email notifications for important updates",
    pushNotifications: "Receive push notifications on mobile devices instantly",
    desktopNotifications: "Get browser and desktop notifications while working",
    taskAssignedAlerts: "Receive alerts whenever a new task is assigned",
    taskStatusUpdates: "Stay updated when task progress or status changes",
    dueDateReminders: "Get reminders before upcoming task deadlines",
    overdueTaskAlerts: "Receive alerts for overdue and delayed tasks",
    mentionsAndComments:
      "Stay informed when mentioned in comments or discussions",
    projectUpdates: "Get project-level updates and important announcements",
    weeklySummary: "Receive weekly productivity and work summary reports",
    monthlyReports: "Receive monthly team and performance reports",
    approvalRequests: "Get alerts for approvals pending your action",
    securityAlerts: "Critical alerts related to login, password, and security",
    billingAlerts: "Updates related to subscription, invoices, and payments",
    systemAnnouncements: "Important product updates and workspace notices",
  };

  const notificationSections = [
    {
      title: "Delivery Channels",
      keys: ["emailNotifications", "pushNotifications", "desktopNotifications"],
    },
    {
      title: "Task & Workflow Alerts",
      keys: [
        "taskAssignedAlerts",
        "taskStatusUpdates",
        "dueDateReminders",
        "overdueTaskAlerts",
        "mentionsAndComments",
        "approvalRequests",
        "projectUpdates",
      ],
    },
    {
      title: "Reports & Productivity Summaries",
      keys: ["weeklySummary", "monthlyReports"],
    },
    {
      title: "Critical System Notifications",
      keys: ["securityAlerts", "billingAlerts", "systemAnnouncements"],
    },
  ];

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: true,
    taskAssignedAlerts: true,
    taskStatusUpdates: true,
    dueDateReminders: true,
    overdueTaskAlerts: true,
    mentionsAndComments: true,
    projectUpdates: true,
    weeklySummary: true,
    monthlyReports: false,
    approvalRequests: true,
    securityAlerts: true,
    billingAlerts: false,
    systemAnnouncements: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const enabledCount = useMemo(() => {
    return Object.values(notifications).filter(Boolean).length;
  }, [notifications]);

  const totalCount = Object.keys(notifications).length;

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setHasChanges(true);
    setSavedMessage("");
  };

  const handleSaveSettings = () => {
    // Replace this with API call later
    console.log("Saved Notification Settings:", notifications);

    setHasChanges(false);
    setSavedMessage("Notification settings saved successfully.");
  };

  return (
    <SectionCard title="Notification Settings" icon={Bell}>
      <div className="space-y-8">
        {/* Header Summary */}
        <div className="rounded-2xl border p-6">
          <h3 className="text-lg font-semibold">
            Workspace Notification Center
          </h3>

          <p className="text-sm text-muted-foreground mt-2">
            Manage alerts, delivery channels, productivity reports, approvals,
            and critical system notifications.
          </p>

          <div className="mt-4 flex gap-3 flex-wrap">
            <Badge>
              Enabled: {enabledCount}/{totalCount}
            </Badge>

            {hasChanges && <Badge variant="outline">Unsaved Changes</Badge>}
          </div>
        </div>

        {/* Dynamic Sections */}
        {notificationSections.map((section) => (
          <div key={section.title} className="rounded-2xl border p-6 space-y-4">
            <h3 className="text-base font-semibold">{section.title}</h3>

            {section.keys.map((key) => (
              <div
                key={key}
                className="flex items-center justify-between border rounded-xl p-4"
              >
                <div className="max-w-xl">
                  <p className="font-medium">{notificationLabels[key]}</p>

                  <p className="text-sm text-muted-foreground">
                    {notificationDescriptions[key]}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant={notifications[key] ? "default" : "outline"}
                  onClick={() => handleToggleNotification(key)}
                >
                  {notifications[key] ? "Enabled" : "Disabled"}
                </Button>
              </div>
            ))}
          </div>
        ))}

        {/* Save Message */}
        {savedMessage && (
          <div className="rounded-xl border p-4 text-sm">{savedMessage}</div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            className="gap-2"
            onClick={handleSaveSettings}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4" />
            Save Notification Settings
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
