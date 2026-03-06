import { sendEmail } from '../../utils/email.util';
import { ConsultaionNote } from '../../models/external/consultationNote.model';
import { Appointment } from '../../models/external/appointment.model';
import { Patient } from '../../models';
import { User } from '../../models/external/user.model';

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

  console.log('FOLLOWUP EMAIL:', patientUser?.email);

  if (!patientUser?.email) return;

  await sendEmail(
    patientUser.email,
    'Follow-up Reminder',
    `
    <h3>Hello ${patientUser.full_name}</h3>
    <p>This is your follow-up reminder.</p>
    `
  );

  console.log('FOLLOWUP EMAIL SENT');
};
