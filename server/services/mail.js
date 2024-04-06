const nodemailer = require("nodemailer");
require("dotenv").config();
console.log(
  process.env.EMAIL_PORT,
  process.env.EMAIL_USERNAME,
  process.env.EMAIL_PASSWORD
);

console.log(process.env.EMAIL_PASSWORD);
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_MAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = { transporter };

// CODE FOR SENDING MAILS USING CLOUD CONSOLE
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: process.env.EMAIL_HOST,
//   port: 587,
//   secure: false,
//   auth: {
//     user: "rohit101010@gmail.com",
//     pass: "vqjklhehxwptgngx",
//     // type: "OAuth2",
//     // user: "rg6058199@gmail.com",
//     // clientId:
//     //   "8226534462-gps9uog1ehg8osm08pmvqv2m9mo2a1m7.apps.googleusercontent.com",
//     // clientSecret: "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",
//     // refreshToken:
//     //   "1//04iChTncoliIXCgYIARAAGAQSNwF-L9IrJIbUI6iYYRqwTOO2UpeiW4gbF_9RW8IMIXoBzBUMb95fv2UH6WcLKvFE1TmcS4u9XUc",
//     // accessToken:
//     //   "ya29.a0AfB_byCIaw4uSxhztiJ7mWfYuQGnf0o08TryqNdFJULDzZJrKt2jrLkGAIQZdNtHv_emN3rFMPslfWOM8CALzY-QGgHFIZgq97RYHCbExpJ9pVkY80qpFX3-kvN0LgB4C2nyrvGpnKxlMwG4xjKGHCETEuFL9nJasuanaCgYKASISARESFQHGX2MiCJxMXCTCi0q_s3IuWkdFVA0171",
//   },
// });
