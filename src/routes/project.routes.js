import { Router } from "express";
import {
  createProject,
  addMembers,
  removeMembers,
  getProjecctMembers,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateMemberRole,
} from "../controllers/project.controllers.js";
import isLoggedin from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/role.js";

const Projectrouter = Router();

Projectrouter.route("/create-project").post(isLoggedin, createProject);
Projectrouter.route("/addMember/:projectid").post(
  isLoggedin,
  isAdmin,
  addMembers,
);
Projectrouter.route("/removeMember/:projectid").post(
  isLoggedin,
  isAdmin,
  removeMembers,
);
Projectrouter.route("/getprojectmembers/:projectid").get(
  isLoggedin,
  isAdmin,
  getProjecctMembers,
);
Projectrouter.route("/getproject").get(isLoggedin,getProjects);
Projectrouter.route("/getprojectbyID/:projectid").get(
  isLoggedin,
  isAdmin,
  getProjectById,
);
Projectrouter.route("/updateproject/:projectid").post(
  isLoggedin,
  isAdmin,
  updateProject,
);
Projectrouter.route("/deleteproject/:projectid").get(
  isLoggedin,
  isAdmin,
  deleteProject,
);
Projectrouter.route("/updatememberrole/:projectid").post(
  isLoggedin,
  isAdmin,
  updateMemberRole,
);

export default Projectrouter;
