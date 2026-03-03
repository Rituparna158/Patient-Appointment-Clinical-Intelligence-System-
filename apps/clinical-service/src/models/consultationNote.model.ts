import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/database';

export class ConsultaionNote extends Model<
  InferAttributes<ConsultaionNote>,
  InferCreationAttributes<ConsultaionNote>
> {
  declare id: CreationOptional<string>;
  declare appointmentId: string;
  declare symptoms: string;
  declare diagnosis: string;
  declare prescriptions: string;
  declare notes: string | null;
  declare createdBy: string;
  declare updatedBy: string | null;
  declare lockedAt: Date | null;
  declare followUpDate: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
ConsultaionNote.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    symptoms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    prescriptions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    lockedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'consultation_notes',
    timestamps: true,
  }
);
