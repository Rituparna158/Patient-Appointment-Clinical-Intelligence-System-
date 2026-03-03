import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../../config/database';
import { DoctorSlot } from './doctorSlot.model';
import { Notification } from './notification.model';

export class Appointment extends Model<
  InferAttributes<Appointment>,
  InferCreationAttributes<Appointment>
> {
  declare id: CreationOptional<string>;
  declare patientId: string;
  declare doctorId: string;
  declare branchId: string;
  declare slotId: string;
  declare status: CreationOptional<string>;
  declare paymentStatus: CreationOptional<string>;
  declare appointmentReason: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    slotId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'requested',
        'confirmed',
        'completed',
        'missed',
        'cancelled'
      ),
      defaultValue: 'requested',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending',
    },
    appointmentReason: {
      type: DataTypes.TEXT,
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
    tableName: 'appointments',
    timestamps: true,
  }
);

Appointment.afterUpdate(async (appointment) => {
  if (appointment.changed('status') && appointment.status === 'confirmed') {
    const slot = await DoctorSlot.findByPk(appointment.slotId);

    if (!slot) return;

    const appointmentStart = new Date(`${slot.slotDate}T${slot.startTime}`);

    const reminderTime = new Date(appointmentStart.getTime() - 60 * 60 * 100);

    if (reminderTime <= new Date()) return;

    await Notification.create({
      appointmentId: appointment.id,
      userId: appointment.patientId,
      type: 'reminder',
      message: 'Reminder: You have an upcoming appointment',
      scheduledAt: reminderTime,
    });
  }
});
