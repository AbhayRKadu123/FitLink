// utils/sendEmail.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(to, subject, htmlText, text) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    text: text || htmlText.replace(/<[^>]+>/g, ""), // fallback plain text
    html: htmlText
  };

  await sgMail.send(msg);
}
