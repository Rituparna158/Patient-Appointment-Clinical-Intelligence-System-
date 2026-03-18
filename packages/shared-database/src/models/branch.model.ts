import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/database';

export class Branch extends Model<
  InferAttributes<Branch>,
  InferCreationAttributes<Branch>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare address: string;
  declare phone: string;
  declare is_active: CreationOptional<boolean>;
}

Branch.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'branches',
    timestamps: true,
  }
);
