import { Appointment } from './external/appointment.model';
import { Patient } from './external/patient.model';
import { Doctor } from './external/doctor.model';
import { DoctorSlot } from './external/doctorSlot.model';
import { User } from './external/user.model';
import { Role } from './external/role.model';
import { ConsultaionNote } from './external/consultationNote.model';

Appointment.belongsTo(Patient, {
  foreignKey: 'patientId',
  as: 'patient',
});

Patient.hasMany(Appointment, {
  foreignKey: 'patientId',
  as: 'appointments',
});

Appointment.belongsTo(Doctor, {
  foreignKey: 'doctorId',
  as: 'doctor',
});

Doctor.hasMany(Appointment, {
  foreignKey: 'doctorId',
  as: 'appointments',
});

Appointment.belongsTo(DoctorSlot, {
  foreignKey: 'slotId',
  as: 'slot',
});

DoctorSlot.hasMany(Appointment, {
  foreignKey: 'slotId',
  as: 'appointments',
});

Patient.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasOne(Patient, {
  foreignKey: 'userId',
  as: 'patient',
});

Doctor.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasOne(Doctor, {
  foreignKey: 'userId',
  as: 'doctor',
});

User.belongsToMany(Role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
  as: 'roles',
});

Role.belongsToMany(User, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId',
  as: 'users',
});

ConsultaionNote.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment',
});

Appointment.hasMany(ConsultaionNote, {
  foreignKey: 'appointmentId',
  as: 'notes',
});
