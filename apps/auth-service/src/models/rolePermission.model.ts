import { DataType, DataTypes } from 'sequelize';
import { ROLES } from '../constants/roles';
import { sequelize } from '../config/database';
//import { object } from 'zod';

const RolePermissionModel = sequelize.define(
  'RolePermission',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'role_permissions',
    timestamps: true,
  }
);
export { RolePermissionModel };
