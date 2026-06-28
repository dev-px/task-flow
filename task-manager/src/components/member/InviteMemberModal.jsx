"use client";

import { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  Download,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabsCompo from "../layout/TabsCompo";

const ROLES = ["Owner", "Admin", "Member", "Viewer"];

export default function InviteMemberModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("Single Invite");

  // Single Invite State
  const [singleForm, setSingleForm] = useState({
    name: "",
    email: "",
    role: "",
    designation: "",
  });
  const [singleErrors, setSingleErrors] = useState({});

  // Bulk Invite State
  const fileInputRef = useRef(null);
  const [parsedData, setParsedData] = useState(null);
  const [bulkErrors, setBulkErrors] = useState([]);

  // ---- VALIDATION LOGIC (Used by both) ----
  const validateRow = (row) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!row.email || !row.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(row.email)) errors.email = "Invalid email format";

    if (!row.role || !row.role.trim()) errors.role = "Role is required";
    else if (!ROLES.includes(row.role))
      errors.role = `Invalid role. Must be: ${ROLES.join(", ")}`;

    return Object.keys(errors).length > 0 ? errors : null;
  };

  // ---- SINGLE INVITE HANDLERS ----
  const handleSingleSubmit = () => {
    const errors = validateRow(singleForm);
    if (errors) {
      setSingleErrors(errors);
      return;
    }
    setSingleErrors({});
    console.log("Submit Single API Payload:", singleForm);
    // TODO: Call your single invite API here
    onClose();
  };

  // ---- BULK INVITE HANDLERS ----
  const downloadTemplate = () => {
    // Generate empty CSV template with exact headers
    const headers = "name,email,role,designation\n";
    const sampleRow = "John Doe,john@example.com,Member,Developer\n"; // Optional sample
    const blob = new Blob([headers + sampleRow], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "invite_template.csv";
    link.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").filter((row) => row.trim() !== "");

      if (rows.length < 2) {
        setBulkErrors([
          { row: 0, message: "File is empty or missing data rows." },
        ]);
        return;
      }

      const headers = rows[0].split(",").map((h) => h.trim().toLowerCase());

      if (!headers.includes("email") || !headers.includes("role")) {
        setBulkErrors([
          {
            row: 0,
            message: "CSV missing required headers: 'email' and 'role'",
          },
        ]);
        return;
      }

      const parsed = [];
      const validationErrors = [];

      // Start from index 1 to skip headers
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(",");
        const rowObj = {};

        headers.forEach((header, index) => {
          rowObj[header] = values[index]?.trim() || "";
        });

        const rowErrors = validateRow(rowObj);
        if (rowErrors) {
          validationErrors.push({ row: i, errors: rowErrors, data: rowObj });
        } else {
          parsed.push(rowObj);
        }
      }

      setParsedData(parsed);
      setBulkErrors(validationErrors);
    };

    reader.readAsText(file);
    e.target.value = null;
  };

  const handleBulkSubmit = () => {
    if (bulkErrors.length > 0) return;
    console.log("Submit Bulk API Payload:", { excelData: parsedData });
    // TODO: Call your bulk invite API here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Invite Members</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs - Wrapping your TabsCompo */}
        <div className="p-5 flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsCompo
              tabs={["Single Invite", "Bulk Invite"]}
              activeTab={activeTab}
            />

            {/* --- SINGLE INVITE TAB --- */}
            <TabsContent value="Single Invite" className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <input
                    type="text"
                    value={singleForm.name}
                    onChange={(e) =>
                      setSingleForm({ ...singleForm, name: e.target.value })
                    }
                    className="w-full border rounded-lg h-10 px-3 outline-none focus:border-black text-sm"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={singleForm.email}
                    onChange={(e) =>
                      setSingleForm({ ...singleForm, email: e.target.value })
                    }
                    className={`w-full border rounded-lg h-10 px-3 outline-none text-sm ${singleErrors.email ? "border-red-500" : "focus:border-black"}`}
                    placeholder="jane@example.com"
                  />
                  {singleErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {singleErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Role *
                  </label>
                  <select
                    value={singleForm.role}
                    onChange={(e) =>
                      setSingleForm({ ...singleForm, role: e.target.value })
                    }
                    className={`w-full border bg-white rounded-lg h-10 px-3 outline-none text-sm ${singleErrors.role ? "border-red-500" : "focus:border-black"}`}
                  >
                    <option value="">Select Role</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {singleErrors.role && (
                    <p className="text-red-500 text-xs mt-1">
                      {singleErrors.role}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={singleForm.designation}
                    onChange={(e) =>
                      setSingleForm({
                        ...singleForm,
                        designation: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg h-10 px-3 outline-none focus:border-black text-sm"
                    placeholder="e.g. Frontend Dev"
                  />
                </div>
              </div>

              <Button
                onClick={handleSingleSubmit}
                className="w-full mt-4 bg-black text-white hover:bg-gray-800"
              >
                Send Invitation
              </Button>
            </TabsContent>

            {/* --- BULK INVITE TAB --- */}
            <TabsContent value="Bulk Invite" className="mt-6">
              <div className="flex justify-between items-center mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  Use our template to ensure correct formatting.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="h-8 text-xs bg-white"
                >
                  <Download size={14} className="mr-2" /> Download Template
                </Button>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
              >
                <UploadCloud size={32} className="text-gray-400 mb-2" />
                <p className="text-sm font-medium">Click to upload CSV</p>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 500 rows supported
                </p>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>

              {/* Status Display Area */}
              {parsedData && bulkErrors.length === 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Ready to upload
                    </p>
                    <p className="text-xs text-green-600">
                      {parsedData.length} valid members found.
                    </p>
                  </div>
                </div>
              )}

              {bulkErrors.length > 0 && (
                <div className="mt-4 border border-red-200 rounded-lg overflow-hidden">
                  <div className="bg-red-50 p-3 border-b border-red-200 flex items-center gap-2 text-red-800 font-medium text-sm">
                    <AlertCircle size={16} /> Error found in {bulkErrors.length}{" "}
                    rows
                  </div>
                  <div className="max-h-32 overflow-y-auto p-3 bg-white space-y-2">
                    {bulkErrors.map((err, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-700 flex justify-between border-b pb-2 last:border-0 last:pb-0"
                      >
                        <span className="font-medium">
                          Row {err.row}: {err.data?.email || "Unknown"}
                        </span>
                        <span className="text-red-500">
                          {err.message ||
                            Object.values(err.errors || {}).join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleBulkSubmit}
                disabled={!parsedData || bulkErrors.length > 0}
                className="w-full mt-4 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
              >
                Upload & Invite {parsedData ? `(${parsedData.length})` : ""}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
