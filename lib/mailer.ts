import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
}

export async function sendMail({ to, subject, html, attachments }: SendMailOptions) {
  const from = process.env.SMTP_FROM || "하이서울기업협회 <contact@itso.co.kr>";
  return transporter.sendMail({ from, to, subject, html, attachments });
}
