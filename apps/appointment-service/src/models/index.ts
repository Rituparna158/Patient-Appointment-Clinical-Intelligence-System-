import { Appointment } from './appointment.model';
import { DoctorSlot } from './doctorSlot.model';
import { Branch } from './branch.model';
import { User } from './external/user.model';
import { Doctor } from './external/doctor.model';
import { Payment } from './payment.model';
import { Patient } from './external/patient.model';

Doctor.hasMany(DoctorSlot, { foreignKey: 'doctorId' });
DoctorSlot.belongsTo(Doctor, { foreignKey: 'doctorId' });

Branch.hasMany(DoctorSlot, { foreignKey: 'branchId' });
DoctorSlot.belongsTo(Branch, { foreignKey: 'branchId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

Branch.hasMany(Appointment, { foreignKey: 'branchId' });
Appointment.belongsTo(Branch, { foreignKey: 'branchId' });

DoctorSlot.hasOne(Appointment, { foreignKey: 'slotId' });
Appointment.belongsTo(DoctorSlot, { foreignKey: 'slotId', as: 'slot' });

Payment.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment',
});

Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

export { Appointment, DoctorSlot, Branch, Doctor };
