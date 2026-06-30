"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

const usePermissions = () => {
  const permissions = useSelector((state) => state.org.permissions) || [];
  const role = useSelector((state) => state.org.role);

  const hasPermission = (permissionString) => {
    return permissions.includes(permissionString);
  };

  const high_roles = ["Admin", "Owner"]
  
  return {
    permissions,
    role,
    hasPermission,
    high_roles,
    isLoading: false,
  };
};

export default usePermissions;
