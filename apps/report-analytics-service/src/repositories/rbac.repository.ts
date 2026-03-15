import { UserRole } from '../models/external/userRole.model';
import { Role } from '../models/external/role.model';
import { RolePermission } from '../models/external/rolePermission.model';
import { Permission } from '../models/external/permission.model';

const getUserRole = (userId: string) => UserRole.findOne({ where: { userId } });

const getRole = (roleId: string) => Role.findByPk(roleId);

const getPermissionsByRole = async (roleId: string) => {
  const rolePermissions = await RolePermission.findAll({ where: { roleId } });

  const permissionIds = rolePermissions.map((rp) => rp.permissionId);

  return Permission.findAll({ where: { id: permissionIds } });
};

export { getUserRole, getRole, getPermissionsByRole };
