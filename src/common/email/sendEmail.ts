import { createTransport, SendMailOptions } from 'nodemailer';

export const sendEmail = async (data: SendMailOptions) => {
  const transporter = createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"E-commerce 🛒" <${process.env.EMAIL}>`,
    ...data,
  });

  if (info.accepted.length) {
    return true;
  }

  return false;
};
