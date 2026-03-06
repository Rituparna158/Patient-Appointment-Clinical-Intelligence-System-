import { transporter } from '../config/mail';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    });
    console.log('EMAIL sent successfully');
  } catch (error) {
    console.error('email error:', error);
  }
};
