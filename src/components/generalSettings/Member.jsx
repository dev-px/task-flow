import { useMemo, useRef, useState } from "react";
import {
  Users,
  UserPlus,
  Upload,
  Search,
  Download,
  Trash2,
  Pencil,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SectionCard from "../layout/SectionCard";
import Field from "../layout/Field";

const defaultMembers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@company.com",
    role: "Project Manager",
    department: "Engineering",
    designation: "Team Lead",
    manager: "Admin",
    employeeId: "EMP-101",
    joiningDate: "2026-01-10",
    workType: "Full Time",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya@company.com",
    role: "UI/UX Designer",
    department: "Design",
    designation: "Senior Designer",
    manager: "Rahul Sharma",
    employeeId: "EMP-102",
    joiningDate: "2026-02-14",
    workType: "Full Time",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Singh",
    email: "amit@company.com",
    role: "Backend Developer",
    department: "Engineering",
    designation: "Software Engineer",
    manager: "Rahul Sharma",
    employeeId: "EMP-103",
    joiningDate: "2026-03-05",
    workType: "Remote",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    email: "sneha@company.com",
    role: "HR Manager",
    department: "Human Resources",
    designation: "HR Lead",
    manager: "Admin",
    employeeId: "EMP-104",
    joiningDate: "2025-12-20",
    workType: "Hybrid",
    status: "On Leave",
  },
  {
    id: 5,
    name: "Vikram Patel",
    email: "vikram@company.com",
    role: "QA Engineer",
    department: "Quality Assurance",
    designation: "QA Specialist",
    manager: "Rahul Sharma",
    employeeId: "EMP-105",
    joiningDate: "2026-01-28",
    workType: "Full Time",
    status: "Inactive",
  },
];

export default function MembersTab() {
  const [members, setMembers] = useState(defaultMembers);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const fileInputRef = useRef(null);

  const [inviteMember, setInviteMember] = useState({
    name: "",
    email: "",
    role: "Member",
    department: "",
    designation: "",
    manager: "",
    employeeId: "",
    joiningDate: "",
    workType: "Full Time",
    status: "Active",
  });

  const updateInvite = (key, value) => {
    setInviteMember((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddMember = () => {
    if (!inviteMember.name || !inviteMember.email) return;

    setMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...inviteMember,
      },
    ]);

    setInviteMember({
      name: "",
      email: "",
      role: "Member",
      department: "",
      designation: "",
      manager: "",
      employeeId: "",
      joiningDate: "",
      workType: "Full Time",
      status: "Active",
    });
  };

  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        member.designation.toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  const handleDelete = (id) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
    setSelectedMember(null);
  };

  const handleEditSave = () => {
    if (!selectedMember) return;

    setMembers((prev) =>
      prev.map((member) =>
        member.id === selectedMember.id ? selectedMember : member,
      ),
    );

    setSelectedMember(null);
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const demoImportedMembers = [
      {
        id: Date.now() + 1,
        name: "Imported User 1",
        email: "import1@company.com",
        role: "Developer",
        department: "Engineering",
        designation: "Frontend Dev",
        manager: "Rahul Sharma",
        employeeId: "IMP-201",
        joiningDate: "2026-04-01",
        workType: "Full Time",
        status: "Active",
      },
      {
        id: Date.now() + 2,
        name: "Imported User 2",
        email: "import2@company.com",
        role: "Designer",
        department: "Design",
        designation: "UI Designer",
        manager: "Priya Verma",
        employeeId: "IMP-202",
        joiningDate: "2026-04-02",
        workType: "Hybrid",
        status: "Active",
      },
    ];

    setMembers((prev) => [...demoImportedMembers, ...prev]);
    e.target.value = "";
  };

  const handleExportMembers = () => {
    const csv = members
      .map(
        (m) =>
          `${m.name},${m.email},${m.designation},${m.department},${m.status}`,
      )
      .join("");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      {/* LEFT SIDE */}
      <SectionCard
        title="Team Member Management"
        icon={Users}
        className="rounded-3xl border"
      >
        <div className="space-y-4">
          <Field label="Full Name">
            <Input
              value={inviteMember.name}
              onChange={(e) => updateInvite("name", e.target.value)}
              placeholder="Enter full name"
            />
          </Field>

          <Field label="Work Email">
            <Input
              value={inviteMember.email}
              onChange={(e) => updateInvite("email", e.target.value)}
              placeholder="Enter work email"
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Designation">
              <Input
                value={inviteMember.designation}
                onChange={(e) => updateInvite("designation", e.target.value)}
                placeholder="Frontend Developer"
              />
            </Field>

            <Field label="Department">
              <Input
                value={inviteMember.department}
                onChange={(e) => updateInvite("department", e.target.value)}
                placeholder="Engineering"
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Reporting Manager">
              <Input
                value={inviteMember.manager}
                onChange={(e) => updateInvite("manager", e.target.value)}
                placeholder="Manager name"
              />
            </Field>

            <Field label="Employee ID">
              <Input
                value={inviteMember.employeeId}
                onChange={(e) => updateInvite("employeeId", e.target.value)}
                placeholder="EMP-102"
              />
            </Field>
          </div>

          <Button
            className="w-full rounded-xl cursor-pointer"
            onClick={handleAddMember}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Bulk Import</h3>
            <Button variant="outline" className="rounded-xl cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              Download Sample Excel
            </Button>
          </div>

          <div className="rounded-2xl border border-dashed p-6 text-center space-y-3">
            <Upload className="mx-auto h-6 w-6" />
            <p className="text-sm text-muted-foreground">
              Upload Excel file (.xlsx) for bulk member import. Missing optional
              fields can be completed later manually.import SectionCard from
              './SectionCard';
            </p>
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden cursor-pointer"
                onChange={handleExcelUpload}
              />
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Excel
              </Button>
            </>
          </div>
        </div>
      </SectionCard>

      {/* RIGHT SIDE */}
      <SectionCard
        title="Member Directory"
        icon={UserPlus}
        className="rounded-3xl"
      >
        <div className="flex flex-1 flex-wrap gap-4 justfy-between w-full mb-5">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search by name, email or designation"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="rounded-xl cursor-pointer"
            onClick={handleExportMembers}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>

        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="cursor-pointer rounded-2xl border p-3 hover:shadow-sm transition bg-accent"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Badge>{member.designation}</Badge>
                  <Badge variant="outline">{member.status}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
      >
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>

          {selectedMember && (
            <div className="grid md:grid-cols-2 gap-4 py-4">
              <Field label="Email">
                <Input
                  value={selectedMember.email}
                  onChange={(e) =>
                    setSelectedMember((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Designation">
                <Input
                  value={selectedMember.designation}
                  onChange={(e) =>
                    setSelectedMember((prev) => ({
                      ...prev,
                      designation: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Department">
                <Input
                  value={selectedMember.department}
                  onChange={(e) =>
                    setSelectedMember((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Joining Date">
                <Input
                  value={selectedMember.joiningDate}
                  onChange={(e) =>
                    setSelectedMember((prev) => ({
                      ...prev,
                      joiningDate: e.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          )}

          <DialogFooter className="flex gap-3">
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>

            <Button
              variant="destructive"
              onClick={() => handleDelete(selectedMember?.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>

            <Button onClick={handleEditSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
