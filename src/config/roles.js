const allRoles = {
  USER: ['getMe', 'crudInformation'],
  ADMIN: ['getUsers', 'manageUsers', 'getMe', 'crudInformation', 'changeBalance'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
