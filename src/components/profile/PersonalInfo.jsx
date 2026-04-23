"use client";

import { useRef, useState } from "react";
import {
  User,
  Camera,
  Save,
} from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import Field from "../layout/Field";
import SectionCard from "../layout/SectionCard";

export default function PersonalInfoTab() {
  const fileInputRef = useRef(null);
  const profileFields = [
    {
      label: "Full Name",
      key: "fullName",
      type: "text",
    },
    {
      label: "Email Address",
      key: "email",
      type: "email",
    },
    {
      label: "Phone Number",
      key: "phone",
      type: "text",
    },
    {
      label: "Employee ID",
      key: "employeeId",
      type: "text",
    },
    {
      label: "Date of Joining",
      key: "joiningDate",
      type: "date",
    },
    {
      label: "Date of Birth",
      key: "dateOfBirth",
      type: "date",
    },
    {
      label: "Gender",
      key: "gender",
      type: "text",
      placeholder: "Male / Female / Prefer not to say",
    },
    {
      label: "Time Zone",
      key: "timezone",
      type: "text",
    },
    {
      label: "Preferred Language",
      key: "preferredLanguage",
      type: "text",
    },
    {
      label: "Address",
      key: "address",
      type: "text",
    },
  ];

  const [profileData, setProfileData] = useState({
    fullName: "Rahul Sharma",
    email: "rahul@company.com",
    phone: "+91 9876543210",
    employeeId: "EMP-2026-104",
    joiningDate: "2024-02-12",
    dateOfBirth: "",
    gender: "",
    address: "Prayagraj, Uttar Pradesh",
    timezone: "Asia/Kolkata",
    preferredLanguage: "English",
    shortBio:
      "Project manager focused on delivery excellence, team collaboration, and process optimization.",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const updateProfile = (key, value) => {
    setProfileData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    setHasChanges(true);
  };

  const handleSaveProfile = () => {
    console.log("Saved Profile:", profileData);
    console.log("Profile Image:", profileImage);

    setHasChanges(false);
  };

  return (
    <SectionCard
      title="Personal Information"
      description="Manage your personal profile details, identity information, and workspace profile visibility."
      icon={User}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT SIDE — Profile Overview */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-2xl border bg-muted">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 rounded-full border bg-background p-2 shadow-sm transition hover:shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                {profileData.fullName}
              </h2>

              <p className="text-sm text-muted-foreground break-all">
                {profileData.email}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Badge>{profileData.employeeId}</Badge>
                <Badge variant="outline">Active Member</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{profileData.department}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Designation</p>
                <p className="font-medium">{profileData.designation}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">Active Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Same as General Tab using SectionCard */}
        <div className="lg:col-span-2">
          <SectionCard title="Personal Details" icon={Save}>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  Update your personal information, employee details, and
                  professional profile settings.
                </p>
              </div>

              {/* Main Fields */}
              <div className="grid gap-5 sm:grid-cols-2">
                {profileFields.map((field) => (
                  <Field key={field.key} label={field.label}>
                    <Input
                      type={field.type}
                      placeholder={field.placeholder || ""}
                      value={profileData[field.key]}
                      onChange={(e) => updateProfile(field.key, e.target.value)}
                    />
                  </Field>
                ))}
              </div>

              {/* Professional Summary */}
              <Field label="Professional Summary">
                <Textarea
                  className="min-h-20"
                  value={profileData.shortBio}
                  onChange={(e) => updateProfile("shortBio", e.target.value)}
                  placeholder="Write a short professional summary..."
                />
              </Field>

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
