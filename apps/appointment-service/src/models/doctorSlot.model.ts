import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/database';

export class DoctorSlot extends Model<
  InferAttributes<DoctorSlot>,
  InferCreationAttributes<DoctorSlot>
> {
  declare id: CreationOptional<string>;
  declare doctorId: string;
  declare branchId: string;
  declare slotDate: string;
  declare startTime: string;
  declare endTime: string;
  declare isBooked: CreationOptional<boolean>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DoctorSlot.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    branchId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    slotDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    isBooked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'doctor_slots',
    timestamps: true,
  }
);
