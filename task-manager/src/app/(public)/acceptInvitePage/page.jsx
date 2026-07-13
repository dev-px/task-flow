"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/layout/Spinner";
import toast from "react-hot-toast";
import { useAcceptInviteMutation, useVerifyInviteQuery } from "@/redux/services/memberApi";
import { setCredentials } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AlertTriangleIcon } from "lucide-react";

const AcceptInvitePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = searchParams.get("token");
  console.log("token", token)

  // Form State for new users
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState({});

  // 1. Automatically Verify the Token on load
  const {
    data: verifyData,
    isLoading: isVerifying,
    isError: isVerifyError,
    error: verifyError
  } = useVerifyInviteQuery({ token }, {
    skip: !token
  });

  // 2. Mutation for Accepting the Invite
  const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteMutation();

  const handleFormValidation = () => {
    const { name, password } = formData;
    let newErrors = { name: "", password: "" };

    if (!password) newErrors.password = "Password is required";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!name) newErrors.name = "Name is required";

    setErrors(newErrors);
    return !newErrors.name && !newErrors.password;
  }

  // 3. Handle Form Submission (Works for both existing and new users)
  const handleAccept = async (e) => {
    if (e) e.preventDefault(); // Only prevent default if triggered by form

    // form validation
    handleFormValidation();

    try {
      // Pass the token in the query, and the formData in the body
      const response = await acceptInvite({ params: { token }, body: formData }).unwrap();
      console.log(response);

      toast.success("Welcome to the workspace!");

      // Because your backend returns accessToken and refreshToken, 
      // you should save them here (e.g., in Redux or Cookies), then redirect.
      // dispatch(setCredentials(response)); 
      if (response?.success) {
        toast.success(response?.message);
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.accessToken,
          }),
        );
        router.push("/organizations");
      }

    } catch (error) {
      toast.error(error?.data?.message || "Failed to accept invite.");
    }
  };

  // --- UI RENDER LOGIC ---

  // State 1: No Token Provided
  if (!token) {
    return <div className="text-center mt-20 text-red-500">No invitation token provided.</div>;
  }

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <Spinner text="Verifying your invitation securely..." />
      </div>
    );
  }

  if (isVerifyError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2"><AlertTriangleIcon className="h-10 w-10" /></h1>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Invitation</h1>
        <p className="text-gray-600">{verifyError?.data?.message || "This link has expired or is invalid."}</p>
        <Button className="mt-4" onClick={() => router.replace("/auth")}>Go to Login</Button>
      </div>
    );
  }

  // Extract data from successful verification
  const { email, organizationId, userExists } = verifyData?.data || {};

  // State 4 & 5: Verified (Show appropriate UI based on userExists)
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-black">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 pb-2 border-b border-black">You've been invited!</h1>
          <p className="text-gray-500 mt-2.5">
            Join the workspace as <span className="font-semibold text-gray-800">{email}</span>
          </p>
        </div>

        {/* Existing User View */}
        {userExists ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm text-center">
              Welcome back! We found an existing account for this email.
            </div>
            <Button
              className="w-full"
              onClick={() => handleAccept()}
              disabled={isAccepting}
            >
              {isAccepting ? "Joining..." : "Accept Invitation"}
            </Button>
          </div>
        ) : (
          /* New User View */
          <form onSubmit={handleAccept} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`border px-3 py-2 rounded w-full ${errors?.name ? "border-red-500" : "border-black"}`}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`border px-3 py-2 rounded w-full ${errors?.password ? "border-red-500" : "border-black"}`}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full mt-4 cursor-pointer" disabled={isAccepting}>
              {isAccepting ? "Creating Account..." : "Create Account & Join"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitePage;