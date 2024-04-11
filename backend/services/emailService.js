const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_SENDER_ACCOUNT,
    pass: process.env.GMAIL_SENDER_PASSWORD,
  },
});

async function sendEmailCode(email, token, siteBaseUrl) {
  const html = `<h1>Teddy Books</h1>
<p>You have requested to reset your password. <a href="${siteBaseUrl+'/reset/'+ token}">Click Here</a> to continue. The link will expire in 24 hours.</p>`;

  try {
    const info = await transporter.sendMail({
      from: `"Teddy Books 🐻" <${process.env.GMAIL_SENDER_ACCOUNT}>`,
      to: email,
      subject: 'Password Reset Request',
      html: html,
    });
    console.log('Reset Password Email Sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {sendEmailCode};
