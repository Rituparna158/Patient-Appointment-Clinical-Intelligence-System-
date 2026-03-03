import { ConsultaionNote } from './consultationNote.model';
import { Appointment } from './external/appointment.model';
import { Doctor } from './external/doctor.model';
import { Patient } from './external/patient.model';
import { User } from './external/user.model';
import { DoctorSlot } from './external/doctorSlot.model';

ConsultaionNote.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment',
});

Appointment.hasOne(ConsultaionNote, {
  foreignKey: 'appointmentId',
  as: 'consultationNote',
});

Appointment.belongsTo(Doctor, {
  foreignKey: 'doctorId',
  as: 'doctor',
});

Doctor.hasMany(Appointment, {
  foreignKey: 'doctorId',
  as: 'appointments',
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

DoctorSlot.hasMany(Appointment, {
  foreignKey: 'slotId',
  as: 'appointments',
});

Doctor.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Patient.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export { ConsultaionNote, Appointment, Doctor, Patient, DoctorSlot, User };
