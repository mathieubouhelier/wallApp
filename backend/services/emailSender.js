require('dotenv').config();
const nodemailer = require('nodemailer');


// Parameters to set nodemailer (email sender)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function emailSender(email,user_name) {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Registered successfully',
    text: `Thank you ${user_name} and welcome!`,
  };

     // module to send email
    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });


}

module.exports = emailSender;
