"use client";

import { useState } from "react";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { KeyRound, Save } from "lucide-react";
import { Input } from "../ui/input";
import SectionCard from "../layout/SectionCard";
import Field from "../layout/Field";

export default function SecuritySettingTab() {
  const [security, setSecurity] = useState({
    passwordPolicy: "Strong",
    minimumPasswordLength: 12,
    passwordExpiryDays: 90,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialCharacters: true,

    twoFactorAuthentication: true,
    enforce2FAForAdmins: true,

    sessionTimeout: "30 mins",
    maxConcurrentSessions: 3,

    loginDeviceRestriction: true,
    allowedDevicesOnly: false,

    ipWhitelisting: false,
    whitelistedIPs: "",

    failedLoginAttemptsLimit: 5,
    accountLockDuration: "30 mins",

    dataExportRestriction: true,
    fileUploadSecurity: true,
    allowedFileTypes: "pdf, docx, xlsx, png, jpg",

    ssoEnabled: false,
    ssoProvider: "",

    backupPolicy: "Daily Backup",
    recoveryPolicy: "7 Days Retention",

    auditLogsEnabled: true,
    securityAlertsEnabled: true,

    complianceStandard: "ISO 27001",
  });

  const updateSecurity = (key, value) => {
    setSecurity((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SectionCard title="Security Settings" icon={KeyRound}>
      <div className="space-y-8">
        {/* Password Policy */}
        <div className="rounded-2xl border p-6 space-y-5">
          <h3 className="text-base font-semibold">Password Policy</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Password Strength">
              <Input
                value={security.passwordPolicy}
                onChange={(e) =>
                  updateSecurity("passwordPolicy", e.target.value)
                }
              />
            </Field>

            <Field label="Minimum Password Length">
              <Input
                type="number"
                value={security.minimumPasswordLength}
                onChange={(e) =>
                  updateSecurity("minimumPasswordLength", e.target.value)
                }
              />
            </Field>

            <Field label="Password Expiry (Days)">
              <Input
                type="number"
                value={security.passwordExpiryDays}
                onChange={(e) =>
                  updateSecurity("passwordExpiryDays", e.target.value)
                }
              />
            </Field>
          </div>
        </div>

        {/* Authentication */}
        <div className="rounded-2xl border p-6 space-y-5">
          <h3 className="text-base font-semibold">Authentication & Access</h3>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "twoFactorAuthentication",
              "enforce2FAForAdmins",
              "loginDeviceRestriction",
              "allowedDevicesOnly",
              "ipWhitelisting",
              "auditLogsEnabled",
              "securityAlertsEnabled",
              "dataExportRestriction",
              "fileUploadSecurity",
            ].map((key) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Security control for{" "}
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </p>
                </div>

                <Badge variant={security[key] ? "default" : "outline"}>
                  {security[key] ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Session & Lock Rules */}
        <div className="rounded-2xl border p-6 space-y-5">
          <h3 className="text-base font-semibold">Session & Lock Rules</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Session Timeout">
              <Input
                value={security.sessionTimeout}
                onChange={(e) =>
                  updateSecurity("sessionTimeout", e.target.value)
                }
              />
            </Field>

            <Field label="Max Concurrent Sessions">
              <Input
                type="number"
                value={security.maxConcurrentSessions}
                onChange={(e) =>
                  updateSecurity("maxConcurrentSessions", e.target.value)
                }
              />
            </Field>

            <Field label="Failed Login Attempt Limit">
              <Input
                type="number"
                value={security.failedLoginAttemptsLimit}
                onChange={(e) =>
                  updateSecurity("failedLoginAttemptsLimit", e.target.value)
                }
              />
            </Field>

            <Field label="Account Lock Duration">
              <Input
                value={security.accountLockDuration}
                onChange={(e) =>
                  updateSecurity("accountLockDuration", e.target.value)
                }
              />
            </Field>
          </div>
        </div>

        {/* Network Security */}
        <div className="rounded-2xl border p-6 space-y-5">
          <h3 className="text-base font-semibold">Network Security</h3>

          <Field label="Whitelisted IP Addresses">
            <Textarea
              placeholder="Example: 192.168.1.1, 10.0.0.1"
              value={security.whitelistedIPs}
              onChange={(e) => updateSecurity("whitelistedIPs", e.target.value)}
            />
          </Field>
        </div>

        {/* File Upload Rules */}
        <div className="rounded-2xl border p-6 space-y-5">
          <h3 className="text-base font-semibold">File Upload Security</h3>

          <Field label="Allowed File Types">
            <Input
              value={security.allowedFileTypes}
              onChange={(e) =>
                updateSecurity("allowedFileTypes", e.target.value)
              }
            />
          </Field>
        </div>

        {/* SSO */}
        <div className="rounded-2xl border p-6 space-y-5">
          <h3 className="text-base font-semibold">Single Sign-On (SSO)</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="SSO Provider">
              <Input
                placeholder="Google / Okta / Azure AD"
                value={security.ssoProvider}
                onChange={(e) => updateSecurity("ssoProvider", e.target.value)}
              />
            </Field>

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-medium">SSO Enabled</p>
                <p className="text-sm text-muted-foreground">
                  Enable enterprise authentication provider
                </p>
              </div>

              <Badge variant={security.ssoEnabled ? "default" : "outline"}>
                {security.ssoEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Backup & Compliance */}
        <div className="rounded-2xl border p-6 space-y-5">
          <h3 className="text-base font-semibold">Backup & Compliance</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Backup Policy">
              <Input
                value={security.backupPolicy}
                onChange={(e) => updateSecurity("backupPolicy", e.target.value)}
              />
            </Field>

            <Field label="Recovery Policy">
              <Input
                value={security.recoveryPolicy}
                onChange={(e) =>
                  updateSecurity("recoveryPolicy", e.target.value)
                }
              />
            </Field>

            <Field label="Compliance Standard">
              <Input
                value={security.complianceStandard}
                onChange={(e) =>
                  updateSecurity("complianceStandard", e.target.value)
                }
              />
            </Field>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Security Settings
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
