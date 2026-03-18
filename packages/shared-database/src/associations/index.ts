import { Appointment } from '../models/appointment.model';
import { DoctorSlot } from '../models/doctorSlot.model';
import { Branch } from '../models/branch.model';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Payment } from '../models/payment.model';
import { Patient } from '../models/patient.model';
import { Notification } from '../models/notification.model';
import { Role } from '../models/role.model';
import { ConsultaionNote } from '../models/consultationNote.model';
import { UserRole } from '../models/userRole.model';
import { Permission } from '../models/permission.model';
import { RolePermission } from '../models/rolePermission.model';

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

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'userId',
  otherKey: 'roleId',
  as: 'roles',
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'roleId',
  otherKey: 'userId',
  as: 'users',
});

Doctor.hasMany(DoctorSlot, {
  foreignKey: 'doctorId',
  as: 'slots',
});

DoctorSlot.belongsTo(Doctor, {
  foreignKey: 'doctorId',
  as: 'doctor',
});

Branch.hasMany(DoctorSlot, {
  foreignKey: 'branchId',
  as: 'slot',
});

DoctorSlot.belongsTo(Branch, {
  foreignKey: 'branchId',
  as: 'branch',
});

Patient.hasMany(Appointment, {
  foreignKey: 'patientId',
  as: 'appointments',
});

Appointment.belongsTo(Patient, {
  foreignKey: 'patientId',
  as: 'patient',
});

Doctor.hasMany(Appointment, {
  foreignKey: 'doctorId',
  as: 'appointments',
});

Appointment.belongsTo(Doctor, {
  foreignKey: 'doctorId',
  as: 'doctor',
});

DoctorSlot.hasOne(Appointment, {
  foreignKey: 'slotId',
  as: 'appointment',
});

Appointment.belongsTo(DoctorSlot, {
  foreignKey: 'slotId',
  as: 'slot',
});

Payment.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment',
});

Appointment.hasOne(Payment, {
  foreignKey: 'appointmentId',
  as: 'payment',
});

Appointment.hasMany(Notification, {
  foreignKey: 'appointmentId',
  as: 'notifications',
});

Notification.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment',
});

Appointment.hasOne(ConsultaionNote, {
  foreignKey: 'appointmentId',
  as: 'consultationNote',
});

ConsultaionNote.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment',
});

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions',
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles',
});
