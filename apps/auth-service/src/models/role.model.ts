import { DataType, DataTypes } from 'sequelize';
import { ROLES } from '../constants/roles';
import { sequelize } from '../config/database';
//import { object } from 'zod';

const RoleModel = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // admin,doctor ,patient
    },
    is_active: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'roles',
    timestamps: true,
  }
);
export { RoleModel };
