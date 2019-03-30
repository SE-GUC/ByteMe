const { SMTP_URL } = process.env;
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const defaultEmailData = { from: "micah10@ethereal.email" };
const sendEmail = (emailData, smtpUrl = SMTP_URL) => {
  const completeEmailData = Object.assign(defaultEmailData, emailData);
  const transporter = nodemailer.createTransport(
    smtpTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "micah10@ethereal.email",
        pass: "Hv9PVnBkQnHCR2zNWP"
      }
    })
  );
  return transporter
    .sendMail(completeEmailData)
    .then(info => console.log(`Mail sent: ${info.response}`))
    .catch(err => console.log(`problem sending mail: ${err}`));
};
module.exports = { sendEmail };
