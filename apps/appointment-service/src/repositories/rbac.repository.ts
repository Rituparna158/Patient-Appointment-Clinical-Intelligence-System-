import { UserRole } from '@repo/shared-database';
import { Role } from '@repo/shared-database';
import { RolePermission } from '@repo/shared-database';
import { Permission } from '@repo/shared-database';

const getUserRole = (userId: string) => UserRole.findOne({ where: { userId } });

const getRole = (roleId: string) => Role.findByPk(roleId);

const getPermissionsByRole = async (roleId: string) => {
  const rolePermissions = await RolePermission.findAll({ where: { roleId } });

  const permissionIds = rolePermissions.map((rp) => rp.permissionId);

  return Permission.findAll({ where: { id: permissionIds } });
};

export { getUserRole, getRole, getPermissionsByRole };
