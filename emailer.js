const { SMTP_URL } = process.env;
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const defaultEmailData = { from: "kassabmoaz@gmail.com" }; //remooove may mail make it dummymail
const sendEmail = (emailData, smtpUrl = SMTP_URL) => {
  const completeEmailData = Object.assign(defaultEmailData, emailData);
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: "kassabmoaz@gmail.com", //should be ${process.env.EMAIL_ADDRESS} or sth...
        pass: "01003442899_moaz" //should be ${process.env.EMAIL_PASSWORD} or sth..
      }
    })
  );
  return transporter
    .sendMail(completeEmailData)
    .then(info => console.log(`Mail sent: ${info.response}`))
    .catch(err => console.log(`problem sending mail: ${err}`));
};
module.exports = { sendEmail };
