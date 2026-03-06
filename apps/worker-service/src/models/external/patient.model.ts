import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
//import { ROLES } from '../../auth-service/src/constants/http-status';
import { sequelize } from '../../config/database';

export class Patient extends Model<
  InferAttributes<Patient>,
  InferCreationAttributes<Patient>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare address: CreationOptional<string>;
  declare emergencyContact: CreationOptional<string>;
  declare isActive: CreationOptional<boolean>;
}
Patient.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'patients',
    timestamps: true,
  }
);
