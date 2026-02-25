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
  declare startTime: Date;
  declare endTime: Date;
  declare isBooked: CreationOptional<boolean>;
  declare isActive: CreationOptional<boolean>;
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
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
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
  },
  {
    sequelize,
    tableName: 'doctor_slots',
    timestamps: true,
  }
);
