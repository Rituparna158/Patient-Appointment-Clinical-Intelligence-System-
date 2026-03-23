import { sendEmail } from '../../utils/email.util';
import { Appointment } from '@repo/shared-database';
import { DoctorSlot } from '@repo/shared-database';
import { Patient } from '@repo/shared-database';
import { User } from '@repo/shared-database';

export const sendAppointmentConfirmation = async (appointmentId: string) => {
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: Patient,
        as: 'patient',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['email', 'full_name'],
          },
        ],
      },
      {
        model: DoctorSlot,
        as: 'slot',
        attributes: ['slotDate', 'startTime'],
      },
    ],
  });

  if (!appointment) return;

  const patientUser = (appointment as any).patient?.user;
  const slot = (appointment as any).slot;

  if (!patientUser?.email || !slot) return;

  await sendEmail(
    patientUser.email,
    'Appointment Confirmed',
    `
    <h3>Hello ${patientUser.full_name}</h3>
    <p>Your appointment is confirmed.</p>
    <p>Date: ${slot.slotDate}</p>
    <p>Time: ${slot.startTime}</p>
    `
  );
};

export const sendAppointmentReminder = async (appointmentId: string) => {
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: Patient,
        as: 'patient',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['email', 'full_name'],
          },
        ],
      },
    ],
  });

  if (!appointment) return;

  const patientUser = (appointment as any).patient?.user;

  if (!patientUser?.email) return;

  await sendEmail(
    patientUser.email,
    'Appointment Reminder',
    `
    <h3>Hello ${patientUser.full_name}</h3>
    <p>This is a reminder for your upcoming appointment.</p>
    `
  );
};
