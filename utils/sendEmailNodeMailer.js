// utils/sendEmailNodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, // ✅ for 465
  auth: {
    user: process.env.EMAIL_USER, // your test email
    pass: process.env.EMAIL_PASS
  },
   tls: {
    rejectUnauthorized: false
  }
});

export async function sendEmailNodemailer(to, subject, text) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
}
