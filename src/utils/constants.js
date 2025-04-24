/**
 * @type {{ADMIN: "admin", PROJECT_ADMIN: "project_admin", MEMBER: "member"} as const}
 */
export const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

/**
 * @type {{TODO: "todo", IN_PROGRESS: "in_progress", DONE: "done"} as const}
 */
export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const AvailableTaskStatuses = Object.values(TaskStatusEnum);

// userRolesEnum.ADMIN -> admin
// AvailableUserRoles will have a object with value from UserRolesEnum ie ["admin", "project_admin", "member"]
// now you can check for available role using AvailableuserRoles.includes(user.role)
