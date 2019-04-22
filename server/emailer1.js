const { SMTP_URL } = process.env;
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const defaultEmailData = {to: "gucmun2019@gmail.com"};
const sendEmail = (emailData, smtpUrl = SMTP_URL) => {
  const completeEmailData = Object.assign(defaultEmailData, emailData);
  const transporter = nodemailer.createTransport(
    smtpTransport({
      host: "smtp.mailgun.org",
      port: 587,
      auth: {
        user: "postmaster@mail.gucmun.me",
        pass: "cde1ff2951ab0e4d6f3ee44aa16170ab-e51d0a44-ac0408c5"
      }
    })
  );
  return transporter
    .sendMail(completeEmailData)
    .then(info => console.log(`Mail sent: ${info.response}`))
    .catch(err => console.log(`problem sending mail: ${err}`));
};
module.exports = { sendEmail };
