import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/database';

export class AnalyticsDaily extends Model<
  InferAttributes<AnalyticsDaily>,
  InferCreationAttributes<AnalyticsDaily>
> {
  declare id: CreationOptional<string>;
  declare date: string;
  declare branchId: string | null;
  declare doctorId: string | null;

  declare totalAppointments: number;
  declare confirmedAppointments: number;
  declare cancelledAppointments: number;
  declare missedAppointments: number;
  declare completedAppointments: number;

  declare totalRevenue: number;
  declare avgConsultationFee: number;

  declare newPatients: number;
  declare uniquePatients: number;

  declare followUpsScheduled: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AnalyticsDaily.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: 'unique_daily_metrics',
    },
    branchId: { type: DataTypes.UUID, allowNull: true },
    doctorId: { type: DataTypes.UUID, allowNull: true },

    totalAppointments: { type: DataTypes.INTEGER, defaultValue: 0 },
    confirmedAppointments: { type: DataTypes.INTEGER, defaultValue: 0 },
    cancelledAppointments: { type: DataTypes.INTEGER, defaultValue: 0 },
    missedAppointments: { type: DataTypes.INTEGER, defaultValue: 0 },
    completedAppointments: { type: DataTypes.INTEGER, defaultValue: 0 },

    totalRevenue: { type: DataTypes.INTEGER, defaultValue: 0 },
    avgConsultationFee: { type: DataTypes.FLOAT, defaultValue: 0 },

    newPatients: { type: DataTypes.INTEGER, defaultValue: 0 },
    uniquePatients: { type: DataTypes.INTEGER, defaultValue: 0 },
    followUpsScheduled: { type: DataTypes.INTEGER, defaultValue: 0 },

    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'analytics_daily_metrics',
    timestamps: true,
    indexes: [
      {
        fields: ['date'],
      },
      {
        fields: ['doctorId'],
      },
      {
        fields: ['branchId'],
      },
      {
        fields: ['doctorId', 'date'],
      },
    ],
  }
);
