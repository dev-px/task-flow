"use client";

import { Briefcase, Save } from "lucide-react";
import Field from "../layout/Field";
import SectionCard from "../layout/SectionCard";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";

export default function ProfessionalInfoTab() {
  const [professionalData, setProfessionalData] = useState({
    jobTitle: "",
    department: "",
    teamName: "",
    reportingManager: "",
    employmentType: "",
    workLocation: "",
    joiningDate: "",

    roleLevel: "",
    accessPermissions: "",
    assignedProjects: "",
    workspaceVisibility: "",

    primarySkills: "",
    secondarySkills: "",
    yearsOfExperience: "",
    currentFocusArea: "",
  });
  
  const professionalFields = [
    {
      section: "Work Profile",
      fields: [
        {
          label: "Job Title",
          key: "jobTitle",
          type: "text",
          placeholder: "e.g. Senior Frontend Developer",
        },
        {
          label: "Department",
          key: "department",
          type: "text",
          placeholder: "e.g. Product Engineering",
        },
        {
          label: "Team Name",
          key: "teamName",
          type: "text",
          placeholder: "e.g. Growth Team",
        },
        {
          label: "Reporting Manager",
          key: "reportingManager",
          type: "text",
          placeholder: "e.g. John Doe",
        },
        {
          label: "Employment Type",
          key: "employmentType",
          type: "text",
          placeholder: "Full-time / Contract / Internship",
        },
        {
          label: "Work Location",
          key: "workLocation",
          type: "text",
          placeholder: "Remote / Hybrid / Office",
        },
        {
          label: "Joining Date",
          key: "joiningDate",
          type: "date",
        },
      ],
    },
    {
      section: "Role & Access",
      fields: [
        {
          label: "Role Level",
          key: "roleLevel",
          type: "text",
          placeholder: "Admin / Manager / Member",
        },
        {
          label: "Access Permissions",
          key: "accessPermissions",
          type: "text",
          placeholder: "Project + HR + Reports",
        },
        {
          label: "Assigned Projects",
          key: "assignedProjects",
          type: "text",
          placeholder: "Website Revamp, CRM Dashboard",
        },
        {
          label: "Workspace Visibility",
          key: "workspaceVisibility",
          type: "text",
          placeholder: "Private / Team / Public",
        },
      ],
    },
    {
      section: "Skills & Expertise",
      fields: [
        {
          label: "Primary Skills",
          key: "primarySkills",
          type: "text",
          placeholder: "React, Next.js, TypeScript",
        },
        {
          label: "Secondary Skills",
          key: "secondarySkills",
          type: "text",
          placeholder: "Node.js, MongoDB",
        },
        {
          label: "Years of Experience",
          key: "yearsOfExperience",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          label: "Current Focus Area",
          key: "currentFocusArea",
          type: "text",
          placeholder: "UI Performance Optimization",
        },
      ],
    },
  ];

  const updateProfessional = (field, value) => {
    setProfessionalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <SectionCard
      title="Professional Information"
      description="Manage your professional details, workspace role, permissions, and expertise."
      icon={Briefcase}
    >
      <div className="space-y-8 mb-5">
        {professionalFields.map((section) => (
          <div
            key={section.section}
            className="rounded-2xl border p-6 space-y-6"
          >
            <div>
              <h3 className="text-base font-semibold">{section.section}</h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {section.fields.map((field) => (
                <Field key={field.key} label={field.label}>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder || ""}
                    value={professionalData[field.key]}
                    onChange={(e) =>
                      updateProfessional(field.key, e.target.value)
                    }
                  />
                </Field>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Footer Save */}
      <div className="flex justify-end pt-2">
        <Button className="rounded-xl px-6 gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </SectionCard>
  );
}
