import Member from "./member.schema.js";
import mongoose from "mongoose";
import Role from "./../role/role.schema.js";
import ApiError from "../../errors/ApiError.js";
import HTTP_STATUS from "../../constants/http-status.constant.js";
import { getUserByEmailArray } from "../user/user.repository.js";

const getMemberByUserIdAndOrganizationId = async (userId, organizationId) => {
  const member = await Member.findOne({ userId, organizationId })
    .populate("roleId organizationId")
    .lean();
  if (!member) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "Membership not found for this user in the organization",
    );
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

const getOrganizationsFromMember = async (
  userId,
  search,
  sortBy,
  isDeleted,
) => {
  const memberQuery = {
    userId: userId,
    status: "active",
    isDeleted: isDeleted,
  };

  const orgMatchQuery = {};
  if (search && search !== "undefined" && search.trim() !== "") {
    orgMatchQuery.name = { $regex: search, $options: "i" };
  }

  let members = await Member.find(memberQuery)
    .populate({
      path: "organizationId",
      match: orgMatchQuery,
    })
    .populate("roleId")
    .lean();

  members = members.filter((member) => member.organizationId !== null);

  members.sort((a, b) => {
    const orgA = a.organizationId;
    const orgB = b.organizationId;

    switch (sortBy) {
      case "oldest":
        // Ascending (1): Older dates go first
        return new Date(orgA.createdAt) - new Date(orgB.createdAt);

      case "name-asc":
        // Ascending (1): A to Z
        return orgA.name.localeCompare(orgB.name);

      case "name-desc":
        // Descending (-1): Z to A
        return orgB.name.localeCompare(orgA.name);

      case "newest":
      default:
        // Descending (-1): Newer dates go first (Fallback default)
        return new Date(orgB.createdAt) - new Date(orgA.createdAt);
    }
  });

  return members;
};

const createMemberForOrganization = async (memberData, session = null) => {
  const [member] = await Member.create([memberData], { session });
  return member;
};

const getMembers = async (organizationId, queryParams = {}) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const { search, status, sortBy, isDeleted } = queryParams;

  // 1. Base Match (Only Organization ID by default!)
  const baseMatch = {
    organizationId: new mongoose.Types.ObjectId(organizationId),
  };

  // Only filter by isDeleted if explicitly requested by the frontend
  if (typeof isDeleted !== "undefined") {
    // Converts string "true"/"false" from query params to actual boolean
    baseMatch.isDeleted = isDeleted === "true" || isDeleted === true;
  }

  // 2. Build the Dynamic Match Object cleanly
  const dynamicMatch = {};

  if (status) dynamicMatch.status = status;

  if (search) {
    dynamicMatch.$or = [
      { "userData.name": { $regex: search, $options: "i" } },
      { "userData.email": { $regex: search, $options: "i" } },
      { inviteEmail: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
    ];
  }

  let dynamicSort = { createdAt: -1 };

  switch (sortBy) {
    case "oldest":
      dynamicSort = { createdAt: 1 };
      break;
    case "name-asc":
      dynamicSort = { "userData.name": 1 };
      break;
    case "name-desc":
      dynamicSort = { "userData.name": -1 };
      break;
    case "newest":
    default:
      dynamicSort = { createdAt: -1 };
      break;
  }

  // 3. The Pipeline
  const pipeline = [
    // Stage 1: Base Match (Gets ALL members for the org)
    { $match: baseMatch },

    // Stage 2: Join with User Collection
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },

    // Stage 3: Join with Role Collection (CRITICAL FOR UI)
    {
      $lookup: {
        from: "roles",
        localField: "roleId",
        foreignField: "_id",
        as: "roleData",
      },
    },
    { $unwind: { path: "$roleData", preserveNullAndEmptyArrays: true } },

    // Stage 4: Apply the dynamic filters we built above
    { $match: dynamicMatch },

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
              status: 1,
              isDeleted: 1,
              joinedAt: "$createdAt",
              inviteEmail: 1,
              user: {
                _id: "$userData._id",
                name: "$userData.name",
                email: { $ifNull: ["$userData.email", "$inviteEmail"] },
                avatarUrl: "$userData.avatarUrl",
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

export default getMembers;

const getMemberById = async (organizationId, memberId, queryParams = {}) => {
  // if admin want to see archieved member
  const isDeleted = queryParams.isDeleted || false;

  const member = await Member.findOne({
    _id: memberId,
    organizationId: organizationId,
    isDeleted: isDeleted,
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
const createMember = async (memberData, session = null) => {
  const member = new Member(memberData);
  return await member.save({ session });
};

// create bulk member
const bulkInsertMembers = async (membersArray) => {
  return await Member.insertMany(membersArray, { ordered: false });
};

// get existing member
const getExistingUsersAndMembers = async (organizationId, emailArray) => {
  // check in both User and Mmeber schema
  const globalUsers = await getUserByEmailArray(emailArray);
  const globalUserIds = globalUsers.map((user) => user._id);

  const members = await Member.find({
    organizationId,
    $or: [
      { inviteEmail: { $in: emailArray } },
      { userId: { $in: globalUserIds } },
    ],
  })
    .select("inviteEmail userId status isDeleted isArchived _id")
    .lean();

  return { globalUsers, members };
};

// update member details
const updateMemberDetails = async (
  organizationId,
  memberId,
  updateData,
  session = null,
) => {
  // Check if updateData already has Mongo operators (like $set or $inc)
  // If it doesn't, we wrap it in $set automatically for convenience.
  const hasOperators = Object.keys(updateData).some((key) =>
    key.startsWith("$"),
  );
  const finalUpdate = hasOperators ? updateData : { $set: updateData };

  return await Member.findOneAndUpdate(
    { _id: memberId, organizationId: organizationId },
    finalUpdate,
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
  getExistingUsersAndMembers,
  updateMemberDetails,
};
