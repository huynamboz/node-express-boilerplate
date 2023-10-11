const allRoles = {
  USER: ['getMe', 'crudInformation', 'loginGG'],
  ADMIN: ['getUsers', 'manageUsers', 'getMe', 'crudInformation', 'changeBalance', 'loginGG', 'admin'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
