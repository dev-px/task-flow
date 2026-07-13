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
import Spinner from "@/components/layout/Spinner";

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
        type="organizations"
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

      {/* If loading or error, handle UI appropriately */}
      {isOrgLoading && <Spinner text="Loading organizations..." />}
      {orgDataError && <p className="text-gray-500 text-center mt-5">Error loading organizations.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
      </div>

      {/* Fallback if no data */}
      {!isOrgLoading && (!orgList || orgList.length === 0) && (
        <p className="text-gray-500 text-center mt-5">No organizations found.</p>
      )}

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
