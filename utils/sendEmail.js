// import nodemailer from 'nodemailer';

// /**
//  * Build HTML email content
//  * @param {string} message - Custom message content
//  * @returns {string} - HTML string
//  */
// function buildHtmlEmail(message) {
//   return `
//     <div style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
//       <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
//         <tr>
//           <td align="center">
//             <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
//               <!-- Header -->
//               <tr>
//                 <td style="background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); padding:25px; text-align:center;">
//                   <h1 style="margin:0; color:#ffffff; font-size:26px; letter-spacing:1px;">FitLink 💪</h1>
//                   <p style="margin:6px 0 0; color:#d1e9ff; font-size:14px;">Track • Train • Transform</p>
//                 </td>
//               </tr>

//               <!-- Body -->
//               <tr>
//                 <td style="padding:30px;">
//                   <h2 style="color:#333333; margin-top:0;">Hello 👋</h2>
//                   <div style="background:#f8fafc; border-left:4px solid #2c5364; padding:15px 18px; border-radius:6px;">
//                     <p style="margin:0; color:#444; font-size:15px; line-height:1.6;">${message}</p>
//                   </div>
//                   <p style="margin-top:25px; color:#555; font-size:14px;">
//                     Stay consistent and keep pushing your limits. FitLink is always here to track your progress 🚀
//                   </p>
//                   <p style="margin-top:30px; color:#777; font-size:13px;">
//                     💡 Tip: Logging workouts regularly helps you grow faster.
//                   </p>
//                 </td>
//               </tr>

//               <!-- Footer -->
//               <tr>
//                 <td style="background:#f1f5f9; padding:18px; text-align:center;">
//                   <p style="margin:0; color:#888; font-size:12px;">This is an automated message from <strong>FitLink</strong>.</p>
//                   <p style="margin:6px 0 0; color:#aaa; font-size:11px;">Please do not reply to this email.</p>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
//     </div>
//   `;
// }

// /**
//  * Send an HTML email via Gmail SMTP
//  * @param {string} to - Recipient email address
//  * @param {string} subject - Email subject
//  * @param {string} message - Custom message/content
//  * @param {string} fromEmail - Gmail address (default: your Gmail)
//  * @param {string} appPassword - Gmail App Password (default: your password)
//  * @returns {Object} - { success: boolean, messageId/error }
//  */
// export async function sendEmail(
//   to,
//   subject,
//   message,
//   fromEmail = 'abhaykadu2201@gmail.com',
//   appPassword = 'ahow pfih mrsw gani'
// ) {
//   try {
//    const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: { user: fromEmail, pass: appPassword },
//   tls: { rejectUnauthorized: false },
//   logger: true,
//   debug: true
// });


//     const htmlContent = buildHtmlEmail(message);

//     const maxRetries = 2;
//     let info;

//     for (let i = 0; i <= maxRetries; i++) {
//       try {
//         info = await transporter.sendMail({
//           from: `"FitLink" <${fromEmail}>`,
//           to,
//           subject,
//           html: htmlContent
//         });
//         console.log('Email sent:', info.messageId);
//         return { success: true, messageId: info.messageId };
//       } catch (err) {
//         if (i === maxRetries) throw err;
//         console.log(`Retrying email... attempt ${i + 1}`);
//       }
//     }
//   } catch (error) {
//     console.error('Error sending email:', error.message);
//     if (error.response) console.error('SendMail response:', error.response);
//     return { success: false, error };
//   }
// }

import SibApiV3Sdk from "sib-api-v3-sdk";
import 'dotenv/config';

/**
 * Build HTML email content
 * (UNCHANGED – your design is 🔥)
 */
function buildHtmlEmail(message) {
  return `
    <div style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              <tr>
                <td style="background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); padding:25px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:26px;">FitLink 💪</h1>
                  <p style="margin:6px 0 0; color:#d1e9ff; font-size:14px;">Track • Train • Transform</p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;">
                  <h2>Hello 👋</h2>
                  <div style="background:#f8fafc; border-left:4px solid #2c5364; padding:15px;">
                    <p>${message}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#f1f5f9; padding:18px; text-align:center;">
                  <p style="font-size:12px;">Automated message from <strong>FitLink</strong></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

/**
 * Brevo setup
 */
// let EmailKey=`${process.env.EmailKey}`;
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.EmailKey;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Send email via Brevo
 */
export async function sendEmail(
  to,
  subject,
  message
) {
  try {
    // console.log('console.log(process.env.EmailKey);',process.env.EmailKey);
    const htmlContent = buildHtmlEmail(message);

    const response = await emailApi.sendTransacEmail({
      sender: {
        email: "abhaykadu2201@gmail.com",
        name: "FitLink",
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    });

    console.log("✅ Email sent:", response.messageId);
    return { success: true, messageId: response.messageId };

  } catch (error) {
    console.error("❌ Email error:", error.response?.text || error.message);
    return { success: false, error };
  }
}
