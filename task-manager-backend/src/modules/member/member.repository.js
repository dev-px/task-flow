import Member from "./member.schema.js";
import mongoose from "mongoose";
import { Role } from "./../role/role.schema.js";
import ApiError from "../../errors/ApiError.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import Counter from "./counter.schema.js";

const getMemberByUserIdAndOrganizationId = async (userId, organizationId) => {
  const member = await Member.findOne({ userId, organizationId })
    .populate("roleId")
    .lean();
  if (!member) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }
  return member;
};

const getMemberByInviteEmailAndOrg = async (
  inviteEmail,
  organizationId,
  session = null,
) => {
  return await Member.findOne({ inviteEmail, organizationId }).session(session);
};

const getOrganizationsFromMember = async (userId) => {
  return await Member.find({
    userId: userId,
    status: "ACTIVE",
  }).populate("organizationId roleId");
};

const createMemberForOrganization = async (memberData, session = null) => {
  const [member] = await Member.create([memberData], { session });
  return member;
};

const getMembers = async (organizationId, queryParams = {}) => {
  // 1. Clean Destructuring & Type Casting
  // Everything coming from req.query is a string. We MUST convert page/limit to numbers.
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const isArchived = queryParams.isArchived || false;

  const { search, designation, status, workType, sortBy, sortOrder } =
    queryParams;

  // 2. Build the Dynamic Match Object cleanly
  const dynamicMatch = {};

  if (designation) dynamicMatch.designation = designation;
  if (status) dynamicMatch.status = status;
  if (workType) dynamicMatch.workType = workType; // You extracted this earlier but forgot to use it!

  if (search) {
    dynamicMatch.$or = [
      { "userData.name": { $regex: search, $options: "i" } },
      { "userData.email": { $regex: search, $options: "i" } }, // Good to search by email too!
      { employeeId: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
    ];
  }

  // We map the frontend query strings to the actual database fields
  const sortFieldMap = {
    name: "userData.name",
    employeeId: "employeeId",
    joiningDate: "createdAt",
  };

  // Default to sorting by joiningDate if they send an invalid string
  const actualSortField = sortFieldMap[sortBy] || "createdAt";

  // Default to descending (-1) unless they explicitly ask for ascending ("asc")
  const actualSortOrder = sortOrder === "asc" ? 1 : -1;

  const dynamicSort = { [actualSortField]: actualSortOrder };

  // 3. The Pipeline
  const pipeline = [
    // Stage 1: Base Match (Indexes hit here!)
    {
      $match: {
        organizationId: new mongoose.Types.ObjectId(organizationId),
        isArchived: isArchived,
      },
    },

    // Stage 2: Join with User Collection
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: "$userData" },

    // Stage 3: Join with Role Collection (CRITICAL FOR UI)
    {
      $lookup: {
        from: "roles",
        localField: "roleId",
        foreignField: "_id",
        as: "roleData",
      },
    },
    { $unwind: "$roleData" },

    // Stage 4: Apply the dynamic filters we built above
    // If there is no search/filter, dynamicMatch is just {}, which is highly optimized.
    {
      $match: dynamicMatch,
    },

    // Stage 5: Pagination & Formatting
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: dynamicSort },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              employeeId: 1,
              designation: 1,
              workType: 1,
              status: 1,
              joinedAt: "$createdAt",
              user: {
                _id: "$userData._id",
                name: "$userData.name",
                email: "$userData.email",
                avatar: "$userData.profilePicture", // Assuming you have an avatar field!
              },
              role: {
                _id: "$roleData._id",
                name: "$roleData.name",
              },
            },
          },
        ],
      },
    },
  ];

  const [result] = await Member.aggregate(pipeline);

  // Return the standard paginated format
  return {
    members: result?.data || [],
    total: result?.metadata[0]?.total || 0,
    page: page,
    limit: limit,
  };
};

const getMemberById = async (organizationId, memberId, queryParams = {}) => {
  // if admin want to see archieved member
  const isArchived = queryParams.isArchived || false;

  const member = await Member.findOne({
    _id: memberId,
    organizationId: organizationId,
    isArchived: isArchived,
  })
    .populate("userId", "name email profilePicture")
    .populate("roleId", "name permissions");

  if (!member) {
    return null;
  }
  return {
    _id: member._id,
    employeeId: member.employeeId,
    designation: member.designation,
    workType: member.workType,
    status: member.status,
    joinedAt: member.createdAt,
    user: member.userId,
    role: member.roleId,
  };
};

// create single member
const createMember = async (memberData) => {
  const member = new Member(memberData);
  return await member.save();
};

// create bulk member
const bulkInsertMembers = async (membersArray) => {
  return await Member.insertMany(membersArray, { ordered: false });
};

// get existing member
const getExistingMembersByEmails = async (organizationId, emailArray) => {
  return await Member.find({
    organizationId,
    inviteEmail: { $in: emailArray },
    status: { $in: ["invited", "active"] }, // Only care if they are currently pending or active
  })
    .select("inviteEmail status")
    .lean();
};

const updateMemberStatus = async (memberId, status) => {
  return await Member.findByIdAndUpdate(memberId, { status }, { new: true });
};

const generateSequentialEmployeeId = async (organizationId, session) => {
  const counter = await Counter.findOneAndUpdate(
    { organizationId },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true, session },
  );

  // Formats to something like "EMP-0001", "EMP-0002"
  return `EMP-${counter.sequenceValue.toString().padStart(4, "0")}`;
};

const updateMemberDetails = async (memberId, updateData, session = null) => {
  return await Member.findByIdAndUpdate(
    memberId,
    { $set: updateData },
    { new: true, session },
  );
};

export {
  getMemberByUserIdAndOrganizationId,
  getMemberByInviteEmailAndOrg,
  getOrganizationsFromMember,
  createMemberForOrganization,
  getMembers,
  getMemberById,
  createMember,
  bulkInsertMembers,
  getExistingMembersByEmails,
  updateMemberStatus,
  updateMemberDetails,
  generateSequentialEmployeeId,
};
