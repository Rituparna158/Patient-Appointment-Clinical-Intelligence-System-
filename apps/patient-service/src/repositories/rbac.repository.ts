import { UserRole } from '../models/rbac/userRole.model';
import { Role } from '../models/rbac/role.model';
import { RolePermission } from '../models/rbac/rolePermission.model';
import { Permission } from '../models/rbac/permission.model';

const getUserRole = (userId: string) => UserRole.findOne({ where: { userId } });

const getRole = (roleId: string) => Role.findByPk(roleId);

const getPermissionsByRole = async (roleId: string) => {
  const rolePermissions = await RolePermission.findAll({ where: { roleId } });

  const permissionIds = rolePermissions.map((rp) => rp.permissionId);

  return Permission.findAll({ where: { id: permissionIds } });
};

export { getUserRole, getRole, getPermissionsByRole };
