import nodemailer from 'nodemailer';

// Create a transporter for sending emails
// You can configure this with your email service provider
const createTransporter = () => {
  // For Gmail, you need to use an App Password (not your regular password)
  // Go to Google Account > Security > 2-Step Verification > App passwords
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD, // Your Gmail App Password
    },
  });
};

interface EmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactNotification(data: EmailData): Promise<boolean> {
  try {
    // Skip email sending if credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.log('Email credentials not configured. Skipping email notification.');
      return false;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'gautamofficial.in@gmail.com', // Your email to receive notifications
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; border: 1px solid #e5e7eb; }
            .message-box { white-space: pre-wrap; }
            .footer { text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px; }
            .reply-btn { display: inline-block; margin-top: 15px; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📬 New Contact Form Submission</h2>
              <p style="margin: 5px 0 0 0;">Someone reached out through your portfolio website!</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value">
                  <a href="mailto:${data.email}" style="color: #10b981;">${data.email}</a>
                </div>
              </div>
              <div class="field">
                <div class="label">💬 Message</div>
                <div class="value message-box">${data.message}</div>
              </div>
              <a href="mailto:${data.email}?subject=Re: Your message to Gautam Kumar" class="reply-btn">
                Reply to ${data.name}
              </a>
            </div>
            <div class="footer">
              <p>This email was sent from your portfolio contact form.</p>
              <p>© ${new Date().getFullYear()} Gautam Kumar Ampolu</p>
            </div>
          </div>
        </body>
        </html>
      `,
      replyTo: data.email,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}
