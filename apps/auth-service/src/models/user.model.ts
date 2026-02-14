import { DataType, DataTypes } from 'sequelize';
import { ROLES } from '../constants/roles';
import { sequelize } from '../config/database';
import { object } from 'zod';

const UserModel = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ROLES.PATIENT,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);
export { UserModel };
