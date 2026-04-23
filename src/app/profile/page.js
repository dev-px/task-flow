"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ProjectHeader from "@/components/project/ProjectHeader";
import TabsCompo from "@/components/layout/TabsCompo";
import PersonalInfoTab from "@/components/profile/PersonalInfo";
import ProfessionalInfoTab from "@/components/profile/ProfessionalInfo";
import AccountSecurityTab from "@/components/profile/AccSecurity";
import PerformanceTab from "@/components/profile/Performace";

const tabs = ["personal Info", "professional Info", "account & Security", "performance"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal Info");

  return (
    <div className="bg-muted/30 p-3">
      <div className="mx-auto max-w-7xl space-y-6">
        <ProjectHeader pTitle="Profile" pDescription="" type="profile" />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsCompo tabs={tabs} activeTab={activeTab} />

          {/* general tab */}
          <TabsContent value="personal Info">
            <PersonalInfoTab />
          </TabsContent>

          <TabsContent value="professional Info">
            <ProfessionalInfoTab />
          </TabsContent>

          <TabsContent value="account & Security">
            <AccountSecurityTab />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
