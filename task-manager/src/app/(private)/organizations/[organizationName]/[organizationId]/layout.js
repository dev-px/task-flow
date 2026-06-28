"use client";

import OrgGuard from "@/components/Guards/OrgGuards";
import { useParams } from "next/navigation";

const OrgGuardLayout = ({ children }) => {
  const params = useParams();
  const { organizationId } = params;
  return <OrgGuard orgId={organizationId}>{children}</OrgGuard>;
};

export default OrgGuardLayout;