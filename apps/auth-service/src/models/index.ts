import { User } from './user.model';
import { Role } from './role.model';
import { Permission } from './permission.model';
import { UserRole } from './userRole.model';
import { RolePermission } from './rolePermission.model';

User.belongsToMany(Role, {
  through: UserRole,
  as: 'roles',
  foreignKey: 'userId',
});
Role.belongsToMany(User, {
  through: UserRole,
  as: 'users',
  foreignKey: 'roleId',
});
Role.belongsToMany(Permission, {
  through: RolePermission,
  as: 'permissions',
  foreignKey: 'roleId',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  as: 'roles',
  foreignKey: 'permissionId',
});
export { User, Role, Permission, UserRole, RolePermission };
