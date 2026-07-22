"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useGetOneOrganizationQuery } from "@/redux/services/orgApi";
import Spinner from "@/components/layout/Spinner"; // Fallback loading component
import { setActiveOrgId, setActiveOrgName, setPermission, setRole } from "@/redux/slices/orgSlice";

const OrgGuard = ({ children, orgId }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // 1. Fetch data strictly using the URL param (orgId)
  const { data, isLoading, isFetching, isError, isSuccess } =
    useGetOneOrganizationQuery(orgId, {
      skip: !orgId,
    });

  // 2. Handle Rehydration of Redux State
  useEffect(() => {
    if (isSuccess && data?.data) {
      const orgData = data.data;
      dispatch(setActiveOrgId(orgId));
      dispatch(setActiveOrgName(orgData?.organization?.name));
      dispatch(setPermission(orgData?.roleId?.permissions));
      dispatch(setRole(orgData?.roleId?.name))
    }
  }, [isSuccess, data, orgId, dispatch]);

  // 3. Handle Unauthorized / Missing Org
  useEffect(() => {
    if (isError) {
      router.replace("/organizations");
    }
  }, [isError, router]);

  // 4. Prevent Flickering (Block rendering until we have the data)
  if (isLoading || isFetching || !isSuccess) {
    return (
      <div className="flex h-full w-full items-center justify-center flex-1">
        <Spinner text="Checking Permissions" />
      </div>
    );
  }

  // If there's an error, render nothing while the useEffect redirects
  if (isError) return null;

  // 5. Safe to render children (permissions and org data are confirmed)
  return <>{children}</>;
};

export default OrgGuard;
