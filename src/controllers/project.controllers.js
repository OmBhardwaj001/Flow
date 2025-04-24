import { Project } from "../models/project.models.js";
import User from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { UserRolesEnum } from "../utils/constants.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getProjects = asyncHandler(async (req, res) => {
  // sare project anege
  const project = await Project.find({
    createdBy: req.user._id,
  });

  const allprojects = project.map((project) => {
    return {
      projectId: project._id,
      name: project.name,
      description: project.description,
    };
  });

  res
    .status(200)
    .json(new ApiResponse(200, "all your projects are:", allprojects));
});

const getProjectById = asyncHandler(async (req, res) => {
  // single project aega
  const { projectid } = req.params;

  const project = await Project.findOne({
    _id: projectid,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(400, "project not found");
  }

  const allprojects = {
    projectid: project._id,
    name: project.name,
    description: project.description,
  };

  res
    .status(200)
    .json(new ApiResponse(200, "all your projects are:", allprojects));
});

const createProject = asyncHandler(async (req, res) => {
  // new project create karo , admin role wala hi kar skta hai
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
  });

  const member = await ProjectMember.create({
    user: req.user._id,
    project: project._id,
    role: UserRolesEnum.ADMIN,
  });

  if (!member) {
    throw new ApiError(400, "error while creating the memeber as admin");
  }

  res.status(200).json(new ApiResponse(200, "project created successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectid } = req.params;
  const { name, description } = req.body;

  await Project.updateOne({ _id: projectid }, { $set: { name, description } });

  res.status(200).json(new ApiResponse(200, "project deatails updated"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectid } = req.params;

  const projecttoremove = await Project.findOneAndDelete({
    _id: projectid,
    createdBy: req.user._id,
  });

  if (!projecttoremove) {
    throw new ApiError(404, " project to be removed not found");
  }

  res.status(200).json(new ApiResponse(200, "project removed"));
});

const addMembers = asyncHandler(async (req, res) => {
  //project me member add karo
  const { projectid } = req.params;
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user doesnt exists");
  }

  await ProjectMember.create({
    user: user._id,
    project: projectid,
    role: UserRolesEnum.MEMBER,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "new member added successfully to project"));
});

const removeMembers = asyncHandler(async (req, res) => {
  // remove member from project

  const { projectid } = req.params;
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "please provide registerd email");
  }

  const usertoremove = await ProjectMember.findOneAndDelete({
    user: user._id,
    project: projectid,
    role: UserRolesEnum.MEMBER,
  });

  if (!usertoremove) {
    throw new ApiError(400, "user is not added as member");
  }

  res.status(200).json(new ApiResponse(200, "member removed successfully"));
});

const getProjecctMembers = asyncHandler(async (req, res) => {
  // get all memeber of project
  const { projectid } = req.params;

  const member = await ProjectMember.find({
    project: projectid,
    role: UserRolesEnum.MEMBER,
  });

  const allmember = member.map((member) => {
    return {
      user: member._id,
    };
  });

  res.status(200).json(new ApiResponse(200, "all members", allmember));
});

const updateMemberRole = asyncHandler(async (req, res) => {
  // update roles

  const { projectid } =  req.params;
  const { email, role } = req.body;
  

  if (!Object.values(UserRolesEnum).includes(role)) {
    throw new ApiError(400, "Invalid role provided");
  }

  const user = await User.findOne({email});
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const projectmember = await ProjectMember.updateOne(
    { user: user._id, project: projectid },
    { $set: { role: UserRolesEnum[role] } },
  );

  res
    .status(200)
    .json(new ApiResponse(200, "member role successfully updated"));
});

export {
  createProject,
  addMembers,
  removeMembers,
  getProjecctMembers,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateMemberRole,
};
       