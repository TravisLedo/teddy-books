const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_SENDER_ACCOUNT, // make env variable
    pass: process.env.GMAIL_SENDER_PASSWORD, // make env variable
  },
});

async function sendEmailCode(email, siteBaseUrl) {
  const html = `<h1>Teddy Books</h1>
<p>You have requested to reset your password. <a href="${siteBaseUrl+'/reset/'+email}">Click Here</a> to continue. The link will expire in 24 hours.</p>`;

  try {
    const info = await transporter.sendMail({
      from: `"Teddy Books 🐻" <${process.env.GMAIL_SENDER_ACCOUNT}>`,
      to: email,
      subject: 'Password Reset Request',
      html: html,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {sendEmailCode};
