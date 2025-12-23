import nodemailer from 'nodemailer';

/**
 * Send an HTML email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} message - Custom message/content
 */
export async function sendEmail(to, subject, message) {
  try {
    // 1. Create transporter (use your email service credentials)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // For Gmail
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'abhaykadu2201@gmail.com',      // your email
        pass: 'ahow pfih mrsw gani' // Gmail App Password if using Gmail
      },
    });

    // 2. Design your HTML email
    const htmlContent = `
      <div style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #0f2027, #203a43, #2c5364); padding:25px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:26px; letter-spacing:1px;">
                FitLink 💪
              </h1>
              <p style="margin:6px 0 0; color:#d1e9ff; font-size:14px;">
                Track • Train • Transform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <h2 style="color:#333333; margin-top:0;">
                Hello 👋
              </h2>

              <div style="background:#f8fafc; border-left:4px solid #2c5364; padding:15px 18px; border-radius:6px;">
                <p style="margin:0; color:#444; font-size:15px; line-height:1.6;">
                  ${message}
                </p>
              </div>

              <p style="margin-top:25px; color:#555; font-size:14px;">
                Stay consistent and keep pushing your limits.  
                FitLink is always here to track your progress 🚀
              </p>

              <p style="margin-top:30px; color:#777; font-size:13px;">
                💡 Tip: Logging workouts regularly helps you grow faster.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9; padding:18px; text-align:center;">
              <p style="margin:0; color:#888; font-size:12px;">
                This is an automated message from <strong>FitLink</strong>.
              </p>
              <p style="margin:6px 0 0; color:#aaa; font-size:11px;">
                Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>
`;

    // 3. Send email
    const info = await transporter.sendMail({
      from: 'FitLink', // sender
      to,
      subject,
      html: htmlContent,
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
