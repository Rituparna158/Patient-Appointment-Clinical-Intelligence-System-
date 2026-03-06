import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../../config/database';

export class Doctor extends Model<
  InferAttributes<Doctor>,
  InferCreationAttributes<Doctor>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare specialization: string;
  declare licence_no: string;
  declare consultation_fee: number;
  declare is_active: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
Doctor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licence_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    consultation_fee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
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
    tableName: 'doctors',
    timestamps: true,
  }
);
