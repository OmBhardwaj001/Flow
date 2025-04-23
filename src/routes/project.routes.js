import { Router } from "express";
import { createProject, addMembers, removeMembers } from "../controllers/project.controllers.js";
import isLoggedin from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/role.js";


const Projectrouter = Router()

Projectrouter.route('/create-project').post(isLoggedin,createProject)
Projectrouter.route('/addMember/:projectid').post(isLoggedin,isAdmin,addMembers)
Projectrouter.route('/removeMember/:projectid').post(isLoggedin,isAdmin,removeMembers);


export default Projectrouter