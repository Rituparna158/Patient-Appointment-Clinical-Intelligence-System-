import { UserModel } from './user.model';
import { RoleModel } from './role.model';
import { PermissionModel } from './permission.model';
import { UserRoleModel } from './userRole.model';
import { RolePermissionModel } from './rolePermission.model';

UserModel.belongsToMany(RoleModel, {
  through: UserRoleModel,
  foreignKey: 'userId',
});
RoleModel.belongsToMany(UserModel, {
  through: UserRoleModel,
  foreignKey: 'roleId',
});
RoleModel.belongsToMany(PermissionModel, {
  through: RolePermissionModel,
  foreignKey: 'roleId',
});
PermissionModel.belongsToMany(RoleModel, {
  through: RolePermissionModel,
  foreignKey: 'permissionId',
});
export {
  UserModel,
  RoleModel,
  PermissionModel,
  UserRoleModel,
  RolePermissionModel,
};
