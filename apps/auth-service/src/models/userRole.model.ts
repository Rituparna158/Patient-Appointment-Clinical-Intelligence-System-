import { DataType, DataTypes } from 'sequelize';
import { ROLES } from '../constants/roles';
import { sequelize } from '../config/database';
//import { object } from 'zod';

const UserRoleModel = sequelize.define(
  'UserRole',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'user_roles',
    timestamps: true,
  }
);
export { UserRoleModel };
