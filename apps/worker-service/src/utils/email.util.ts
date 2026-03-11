import { transporter } from '../config/mail';

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  attachmentPath?: string
) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
      attachments: attachmentPath
        ? [
            {
              filename: 'analytics-report.csv',
              path: attachmentPath,
            },
          ]
        : [],
    };
    await transporter.sendMail(mailOptions);
    console.log('EMAIL sent successfully');
  } catch (error) {
    console.error('email error:', error);
  }
};
