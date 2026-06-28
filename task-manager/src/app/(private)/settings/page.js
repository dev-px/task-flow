"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ProjectHeader from "@/components/project/ProjectHeader";
import TabsCompo from "@/components/layout/TabsCompo";
import MembersTab from "@/components/generalSettings/Member";
import RoleSettingsTab from "@/components/generalSettings/Roles";
import SecuritySettingTab from "@/components/generalSettings/Security";
import NotificationSettingTab from "@/components/generalSettings/Notification";
import BillingSettingsTab from "@/components/generalSettings/Billing";
import GeneralSettingTab from "@/components/generalSettings/General";

const tabs = [
  "general",
  "members",
  "roles",
  "security",
  "notifications",
  "billing",
];

export default function GlobalSettingsUI() {
  const [activeTab, setActiveTab] = useState("general");


  return (
    <div className="bg-muted/30 p-3">
      <div className="mx-auto max-w-7xl space-y-6">
        <ProjectHeader
          pTitle="General Settings"
          pDescription=""
          type="gSettings"
        />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsCompo tabs={tabs} activeTab={activeTab} />

          {/* general tab */}
          <TabsContent value="general">
            <GeneralSettingTab />
          </TabsContent>

          {/* member tab */}
          <TabsContent value="members" className="space-y-6">
            <MembersTab />
          </TabsContent>

          {/* role tab */}
          <TabsContent value="roles">
            <RoleSettingsTab />
          </TabsContent>

          {/* security tab */}
          <TabsContent value="security">
            <SecuritySettingTab />
          </TabsContent>

          {/* notification tab */}
          <TabsContent value="notifications">
            <NotificationSettingTab />
          </TabsContent>

          {/* billing tab */}
          <TabsContent value="billing">
            <BillingSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

