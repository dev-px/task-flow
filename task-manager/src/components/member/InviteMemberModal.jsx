"use client";

import toast from "react-hot-toast";
import TabsCompo from "../layout/TabsCompo";
import usePermissions from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useGetAllRolesQuery } from "@/redux/services/rolesApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import {
  X,
  UploadCloud,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  useBulkInviteMutation,
  useInviteSingleMemberMutation,
} from "@/redux/services/memberApi";

export default function InviteMemberModal({ onClose, orgId }) {
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState("Single Invite");

  // Single Invite State
  const [singleForm, setSingleForm] = useState({
    email: "",
    role: "",
    designation: "",
  });
  const [singleErrors, setSingleErrors] = useState({
    email: "",
    role: "",
    designation: ""
  });
  const [
    inviteSingleMember,
    { isLoading: IsSingleLoading, isError: singleError },
  ] = useInviteSingleMemberMutation();

  // role for single invite
  const { data, isLoading: isRoleLoading } =
    useGetAllRolesQuery(
      { orgId, queryParams: { isDeleted: false } },
      { skip: (!orgId || !hasPermission("member:create")) }
    );

  // Bulk Invite State
  const fileInputRef = useRef(null);
  const [parsedData, setParsedData] = useState(null);
  const [bulkErrors, setBulkErrors] = useState([]);
  const [apiFailedList, setApiFailedList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [
    bulkInvite,
    { isLoading: IsBulkLoading, isError: BulkError },
  ] = useBulkInviteMutation();

  const validateRow = (row) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!row.email || !row.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(row.email)) errors.email = "Invalid email format";
    if (!row.role || !row.role.trim()) errors.role = "Role is required";
    if (!row.designation || !row.designation.trim()) errors.designation = "Designation is required";

    return Object.keys(errors).length > 0 ? errors : null;
  };

  // ---- SINGLE INVITE HANDLERS ----
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setSingleErrors(validateRow(singleForm));
    try {
      const response = await inviteSingleMember({ orgId, body: singleForm }).unwrap();
      console.log("response", response)
      toast.success(`Sending invitation to ${singleForm?.name} successfully`)
      setSingleForm({
        email: "",
        role: "",
        designation: "",
      })
      onClose();
    } catch (error) {
      toast.error(error.data?.message);
      setSingleErrors(error.data?.errors);
    }
  };

  // ---- BULK INVITE HANDLERS ----
  const downloadTemplate = () => {
    // Generate empty CSV template with exact headers
    const headers = "email,role,designation\n";
    const blob = new Blob([headers], {
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

  const handleBulkSubmit = async () => {
    if (bulkErrors.length > 0) return;

    try {
      const response = await bulkInvite({ orgId, excelData: parsedData }).unwrap();
      const failedItems = response?.data?.failed || response?.data?.data?.failed || [];

      if (failedItems.length > 0) {
        setApiFailedList(failedItems);
        setIsDialogOpen(true);
        toast.success(response?.message || response?.data?.message || `Sent successfully, but some failed.`);
      } else {
        toast.success(`Invitation sent to all ${parsedData.length} members`);
        onClose();
      }
    } catch (error) {
      const failedItems = error?.data?.data?.failed || error?.data?.failed || [];
      if (failedItems.length > 0) {
        setApiFailedList(failedItems);
        setIsDialogOpen(true);
        toast.error(error?.data?.message || "Some invitations failed to send.");
      } else {
        toast.error(error?.data?.message || "An unexpected error occurred.");
      }
    }
  };

  const rolesData = data?.data || [];

  return (
    <>
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
              <TabsContent value="Single Invite" className="mt-4">
                <form id="member-sinlge-invite" onSubmit={handleSingleSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={singleForm?.email}
                        onChange={(e) =>
                          setSingleForm({ ...singleForm, email: e.target.value })
                        }
                        className={`w-full border rounded-lg h-10 px-3 outline-none text-sm ${singleErrors?.email ? "border-red-500" : "focus:border-black"}`}
                        placeholder="jane@example.com"
                      />
                      {singleErrors?.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {singleErrors?.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Role
                      </label>
                      <select
                        value={singleForm?.role}
                        onChange={(e) =>
                          setSingleForm({ ...singleForm, role: e.target.value })
                        }
                        className={`w-full border bg-white rounded-lg h-10 px-3 outline-none text-sm ${singleErrors?.role ? "border-red-500" : "focus:border-black"}`}
                      >
                        <option value="">Select Role</option>
                        {rolesData.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      {singleErrors?.role && (
                        <p className="text-red-500 text-xs mt-1">
                          {singleErrors?.role}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={singleForm?.designation}
                        onChange={(e) =>
                          setSingleForm({
                            ...singleForm,
                            designation: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg h-10 px-3 outline-none focus:border-black text-sm"
                        placeholder="e.g. Frontend Dev"
                      />
                      {singleErrors?.designation && (
                        <p className="text-red-500 text-xs mt-1">
                          {singleErrors?.designation}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-4 bg-black text-white hover:bg-gray-800"
                    disabled={IsSingleLoading}
                  >
                    {IsSingleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                    {IsSingleLoading ? "Sending Invitation..." : "Send Invitation"}
                  </Button>
                </form>
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
                  disabled={!parsedData || bulkErrors.length > 0 || IsBulkLoading}
                  className="w-full mt-4 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
                >
                  {IsBulkLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                  {IsBulkLoading ? "Uploading & Inviting..." : "Upload & Invite"}
                  {parsedData ? `(${parsedData.length})` : ""}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {/* --- failure dialog --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 text-lg">
              <AlertCircle size={18} className="text-red-500" />
              Invite Issues
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              We processed your file, but these invitations couldn't be sent:
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto space-y-2 p-1">
            {apiFailedList.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-gray-200 bg-transparent flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-900">{item.email}</span>
                <span className="text-xs text-red-500">{item.reason}</span>
              </div>
            ))}
          </div>

          <DialogFooter className="sm:justify-end gap-2 mt-2">
            <Button
              type="button"
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => {
                setIsDialogOpen(false);
                onClose();
              }}
            >
              Review Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}