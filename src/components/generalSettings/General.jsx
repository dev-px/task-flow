"use client";

import { Building2, Save } from "lucide-react";
import { Button } from "../ui/button";
import SectionCard from "../layout/SectionCard";
import { useState } from "react";
import { Input } from "../ui/input";
import Field from "../layout/Field";

export default function GeneralSettingTab() {
  const [organization, setOrganization] = useState({
    organizationName: "TechNova Pvt Ltd",
    logo: "",
    companyEmail: "admin@technova.com",
    companyPhone: "+91 9876543210",
    website: "https://technova.com",
    supportEmail: "support@technova.com",
    address: "Prayagraj, Uttar Pradesh",
    timezone: "Asia/Kolkata",
    defaultLanguage: "English",
    workingDays: "Mon-Fri",
    businessHours: "10 AM - 7 PM",
  });

  const updateOrganization = (key, value) => {
    setOrganization((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SectionCard title="Organization Profile" icon={Building2}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT SIDE — Logo / Company Overview */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-2xl border bg-muted flex items-center justify-center overflow-hidden shadow-sm">
                {organization.logo ? (
                  <img
                    src={organization.logo}
                    alt="Company Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                {organization.organizationName}
              </h2>

              <p className="text-sm text-muted-foreground">
                Manage your company profile, workspace branding, and
                organization details for your team management system.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Business Hours</p>
                <p className="font-medium">{organization.businessHours}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Working Days</p>
                <p className="font-medium">{organization.workingDays}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Timezone</p>
                <p className="font-medium">{organization.timezone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Use SectionCard */}
        <div className="lg:col-span-2">
          <SectionCard title="Edit Organization Details" icon={Save} description="Update your company information, workspace branding, and communication details.">
            <div className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-4">
                <Field label="Upload Company Logo">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        updateOrganization("logo", imageUrl);
                      }
                    }}
                  />
                </Field>

                <Field label="Logo Image URL">
                  <Input
                    placeholder="Paste logo image URL"
                    value={organization.logo}
                    onChange={(e) => updateOrganization("logo", e.target.value)}
                  />
                </Field>
              </div>

              {/* Main Fields */}
              <div className="grid gap-5 md:grid-cols-2">
                {Object.keys(organization)
                  .filter((key) => key !== "logo")
                  .map((key) => (
                    <Field
                      key={key}
                      label={key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    >
                      <Input
                        value={organization[key]}
                        onChange={(e) =>
                          updateOrganization(key, e.target.value)
                        }
                      />
                    </Field>
                  ))}
              </div>

              {/* Footer Save */}
              <div className="flex justify-end pt-2">
                <Button className="rounded-xl px-6 gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </SectionCard>
  );
}
