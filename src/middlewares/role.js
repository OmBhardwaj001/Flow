const { ProjectMember } = require("../models/projectmember.models");
const { ApiError } = require("../utils/api-error");
const { UserRolesEnum } = require("../utils/constants");

const isAdmin = async (req, res, next) => {
  const { projectid } = req.params;

  const member = await ProjectMember.findOne({
    user: req.user._id,
    project: projectid,
  });

  if (
    !member ||
    ![UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN].includes(member.role)
  ) {
    throw new ApiError(400, "only admin can do this");
  }

  next();
};

export default isAdmin;
