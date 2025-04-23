import { Project } from "../models/project.models.js";
import User from "../models/user.models.js";
import {ProjectMember} from "../models/projectmember.models.js"
import { UserRolesEnum } from "../utils/constants.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";


const getProjects = asyncHandler(async (req,res)=>{
    // sare project anege
 })

 const getProjectById = asyncHandler(async (req,res)=>{
    const {email , username, password , role} = req.body;

    // single project aega
    
 
 })

 const createProject = asyncHandler(async (req,res)=>{
    // new project create karo , admin role wala hi kar skta hai
    const {name, description} = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy:req.user._id
    })
    
    const member = await ProjectMember.create({
      user:req.user._id,
      project:project._id,
      role:UserRolesEnum.ADMIN
    })

    if(!member)
    {
      throw new ApiError(400,"error while creating the memeber as admin");
    }

    

    res.status(200).json(new ApiResponse(200,"project created successfully"));

 })

 const updateProject = asyncHandler(async (req,res)=>{
    const {email , username, password , role} = req.body;

    // update project
    
 
 })

 const deleteProject = asyncHandler(async (req,res)=>{
    const {email , username, password , role} = req.body;

    // delete project
    
 
 })

 const addMembers = asyncHandler(async (req,res)=>{
    //project me member add karo
    const {projectid} = req.params;
    const {email} = req.body;

    const user = await User.findOne({email});
    if(!user)
    {
      throw new ApiError(400,"user doesnt exists");
    }

    await ProjectMember.create({
      user:user._id,
      project:projectid,
      role:UserRolesEnum.MEMBER
    })

    res.status(200).json(new ApiResponse(200,"new member added successfully to project"))
 })

 const removeMembers = asyncHandler(async (req,res)=>{
    // remove member from project

    const {projectid} = req.params;
    const {email} = req.body;

    const user = await User.findOne({email});
    if(!user)
    {
      throw new ApiError(400,"please provide registerd email");
    }

    const usertoremove = await ProjectMember.findOneAndDelete({
     user:user._id,
      project:projectid,
      role:UserRolesEnum.MEMBER
    })

    if(!usertoremove)
    {
      throw new ApiError(400,"user is not added as member");
    }

    res.status(200).json(new ApiResponse(200,"member removed successfully"));
 })

 const getProjecctMembers = asyncHandler(async (req,res)=>{
    const {email , username, password , role} = req.body;

    // get all memeber of project
    
 
 })

 const updateProjectMembers = asyncHandler(async (req,res)=>{
    const {email , username, password , role} = req.body;

    // update project member out/in
    
 
 })

 const updateMemberRole = asyncHandler(async (req,res)=>{
    const {email , username, password , role} = req.body;

    // update roles
    
 
 })

 const deleteMember = asyncHandler(async (req,res)=>{
    const {email , username, password , role} = req.body;

    // remove members
    
 
 })

 export {createProject, addMembers, removeMembers}