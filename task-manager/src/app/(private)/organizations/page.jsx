"use client";

import React, { useState } from "react";
import AddOrgDialog from "@/components/organizations/AddOrgDialog";
import OrganizationCard from "@/components/organizations/OrganizationCard";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";
import { useGetAllOrganizationsQuery } from "@/redux/services/orgApi";
import { initialOrgCreateState, initialOrgFilterState } from "@/utils/constant";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setActiveOrgId, setActiveOrgName } from "@/redux/slices/orgSlice";

const Organization = () => {
  const [filters, setFilters] = useState(initialOrgFilterState);
  const [showCreateOrgModal, setCreateShowOrgModal] = useState(false);
  const [form, setForm] = useState(initialOrgCreateState);
  const [formType, setFormType] = useState("create");
  const dispatch = useDispatch();

  const {
    data: orgData,
    isLoading: isOrgLoading,
    isError: orgDataError,
  } = useGetAllOrganizationsQuery(filters);
  const orgList = orgData?.data || orgData || [];

  const handleOpenCreateModal = () => {
    setFormType("create");
    setForm(initialOrgCreateState);
    setCreateShowOrgModal(true);
  };

  const handleEditOrganization = (org) => {
    setFormType("edit");
    setForm(org?.organization);
    setCreateShowOrgModal(true);
  };

  const handleOrgDispatch = (org) => {
    dispatch(setActiveOrgId(org?._id));
    dispatch(setActiveOrgName(org?.name));
  };

  return (
    <div>
      <ProjectHeader
        pTitle="Organizations"
        pDescription="Manage and organize your organizations."
        type="Organization"
        setShowModal={setCreateShowOrgModal}
        handleProjectManipulation={handleOpenCreateModal}
      />

      {/* Project page filter section */}
      <ProjectFilters
        page="organizations"
        filters={filters}
        setFilters={setFilters}
        onClearFilter={() => setFilters(initialOrgFilterState)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* If loading or error, handle UI appropriately */}
        {isOrgLoading && <p>Loading organizations...</p>}
        {orgDataError && <p>Error loading organizations.</p>}

        {/* Map through the API response data */}
        {orgList?.map((org) => (
          <Link
            key={org?.organization._id}
            onClick={() => handleOrgDispatch(org?.organization)}
            href={`/organizations/${org?.organization.name}/${org?.organization._id}`}
          >
            <OrganizationCard
              org={org?.organization}
              onEdit={() => handleEditOrganization(org)}
            />
          </Link>
        ))}

        {/* Fallback if no data */}
        {!isOrgLoading && (!orgData || orgData.length === 0) && (
          <p className="text-gray-500">No organizations found.</p>
        )}
      </div>

      <AddOrgDialog
        showModal={showCreateOrgModal}
        setShowModal={setCreateShowOrgModal}
        form={form}
        setForm={setForm}
        type={formType}
      />
    </div>
  );
};

export default Organization;
