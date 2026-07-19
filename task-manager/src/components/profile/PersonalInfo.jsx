"use client";

import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Camera, Save } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Field from "../layout/Field";
import SectionCard from "../layout/SectionCard";
import Spinner from "../layout/Spinner";
import { useUpdateUserProfileMutation } from "@/redux/services/userApi";
import toast from "react-hot-toast";

// Import your mutation and slice action
// import { useUpdateProfileMutation } from "@/redux/services/authApi";
// import { updateUserProfile } from "@/redux/slices/authSlice";

export default function PersonalInfoTab() {
  const dispatch = useDispatch();

  // 1. Get user directly from Redux Store (Populated during Login/Refresh)
  const user = useSelector((state) => state.auth.user);

  // 2. Setup RTK Query Mutation for API call
  const [updateProfileMutation, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const fileInputRef = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    secondaryEmail: "",
  });

  // 3. Sync Redux state to local component state when it loads or changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        secondaryEmail: user.secondaryEmail || "",
      });
      setAvatarPreview(user.avatarUrl || "");
      setHasChanges(false);
    }
  }, [user]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Standard client side file preview
    const imageUrl = URL.createObjectURL(file);
    setAvatarPreview(imageUrl);
    setHasChanges(true);

    // Note: If uploading to S3/Cloudinary, you would trigger that upload logic here
    // or inside handleSaveProfile before sending the URL to your backend.
  };

  const handleSaveProfile = async () => {
    try {
      // 4. Send update to Backend (modules/user)
      const payload = {
        name: formData.name,
        secondaryEmail: formData.secondaryEmail,
        avatarUrl: avatarPreview,
      };

      const response = await updateProfileMutation(payload).unwrap();

      // 5. Update Redux Store instantly (Assuming backend returns the updated user object)
      // If your backend wraps it in 'data' (e.g., response.data.user), adjust accordingly:
      const updatedUser = response.user || response.data;

      dispatch(updateUserProfile(updatedUser));
      setHasChanges(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err.data.message)
    }
  };

  if (!user)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  return (
    <SectionCard
      title="Personal Information"
      description="Manage your verified profile details, identity variables, and account state indices."
      icon={User}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT CARD — Identity Indicators */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-2xl border bg-muted">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
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

              <h2 className="mt-4 text-lg font-semibold">{formData.name}</h2>
              <p className="text-sm text-muted-foreground break-all">
                {formData.email}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <Badge
                  variant={user.isEmailVerified ? "default" : "destructive"}
                >
                  {user.isEmailVerified ? "Verified Email" : "Unverified Email"}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  Status: {user.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t text-xs text-muted-foreground">
              <p>
                Account Created:{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CARD — Core Schema Inputs */}
        <div className="lg:col-span-2">
          <SectionCard title="Database Parameters" icon={Save}>
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name">
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </Field>

                <Field label="Primary Email Address (Immutable)">
                  <Input
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </Field>

                <Field label="Secondary Recovery Email">
                  <Input
                    type="email"
                    placeholder="Enter secondary fallback email address"
                    value={formData.secondaryEmail}
                    onChange={(e) =>
                      handleChange("secondaryEmail", e.target.value)
                    }
                  />
                </Field>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={!hasChanges || isUpdating}
                  className="rounded-xl px-6 gap-2"
                >
                  {isUpdating ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
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
