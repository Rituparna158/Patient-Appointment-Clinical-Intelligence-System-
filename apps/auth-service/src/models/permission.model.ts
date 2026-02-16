import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
//import { object } from 'zod';

const PermissionModel = sequelize.define(
  'Permission',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, //manage_users,manage_appointments
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'permissions',
    timestamps: true,
  }
);
export { PermissionModel };
