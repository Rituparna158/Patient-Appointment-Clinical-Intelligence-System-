import { sequelize } from '../config/database';

import { User } from './external/user.model';
import { Role } from './external/role.model';
import { Doctor } from './external/doctor.model';
import { DoctorSlot } from './external/doctorSlot.model';
import { Appointment } from './external/appointment.model';
import { ConsultaionNote } from './external/consultationNote.model';
import { Patient } from './external/patient.model';

User.belongsToMany(Role, {
  through: 'user_roles',
  foreignKey: 'userId',
  as: 'roles',
});

Role.belongsToMany(User, {
  through: 'user_roles',
  foreignKey: 'roleId',
  as: 'users',
});

Doctor.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasOne(Doctor, {
  foreignKey: 'userId',
  as: 'doctor',
});

Patient.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasOne(Patient, {
  foreignKey: 'userId',
  as: 'patient',
});

DoctorSlot.belongsTo(Doctor, {
  foreignKey: 'doctorId',
  as: 'doctor',
});

Doctor.hasMany(DoctorSlot, {
  foreignKey: 'doctorId',
  as: 'slots',
});

Appointment.belongsTo(Patient, {
  foreignKey: 'patientId',
  as: 'patient',
});

Patient.hasMany(Appointment, {
  foreignKey: 'patientId',
  as: 'appointments',
});

Appointment.belongsTo(DoctorSlot, {
  foreignKey: 'slotId',
  as: 'slot',
});

DoctorSlot.hasOne(Appointment, {
  foreignKey: 'slotId',
  as: 'appointment',
});

ConsultaionNote.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment',
});

Appointment.hasOne(ConsultaionNote, {
  foreignKey: 'appointmentId',
  as: 'consultationNote',
});

export {
  sequelize,
  User,
  Role,
  Doctor,
  Patient,
  DoctorSlot,
  Appointment,
  ConsultaionNote,
};
