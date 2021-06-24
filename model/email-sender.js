const sgMail = require('@sendgrid/mail');
require('dotenv').config();

class CreateSenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    return await sgMail.send({ ...msg, from: 'yaroslavdmu45@gmail.com' });
  }
}

module.exports = { CreateSenderSendGrid };
