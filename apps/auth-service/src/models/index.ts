import { User } from './user.model';
import { Role } from './role.model';
import { Permission } from './permission.model';
import { UserRole } from './userRole.model';
import { RolePermission } from './rolePermission.model';
import { Doctor } from './doctor.model';

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
User.hasOne(Doctor, {
  foreignKey: 'userId',
  as: 'doctorprofile',
});
Doctor.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
export { User, Role, Permission, UserRole, RolePermission, Doctor };
