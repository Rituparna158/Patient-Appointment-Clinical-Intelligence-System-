import { sendEmail } from '../../utils/email.util';
import { ConsultaionNote } from '@repo/shared-database';
import { Appointment } from '@repo/shared-database';
import { Patient } from '@repo/shared-database';
import { User } from '@repo/shared-database';

export const sendFollowupReminder = async (consultationId: string) => {
  const note = await ConsultaionNote.findByPk(consultationId, {
    include: [
      {
        model: Appointment,
        as: 'appointment',
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
      },
    ],
  });

  if (!note) return;

  const patientUser = (note as any).appointment?.patient?.user;

  if (!patientUser?.email) return;

  await sendEmail(
    patientUser.email,
    'Follow-up Reminder',
    `
    <h3>Hello ${patientUser.full_name}</h3>
    <p>This is your follow-up reminder.</p>
    `
  );
};
