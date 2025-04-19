const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

function replaceContent(content, creds) {
  const allKeys = Object.keys(creds);
  allKeys.forEach((key) => {
    content = content.replace(`#{${key}}`, creds[key]);
  });
  return content;
}

async function EmailHelper(templateName, receiverEmail, creds) {
  try {
    const templatePath = path.join(__dirname, "email_templates", templateName);

    let content = await fs.promises.readFile(templatePath, "utf-8");

    const emailDetails = {
      to: receiverEmail,
      from: "vamseekrishna.private@gmail.com",
      subject: "Mail from BookMyShow",
      text: `Hi ${creds.name} this is your reset otp ${creds.otp}`,
      html: replaceContent(content, creds),
    };
    // const transportDetails = {
    //   host: "smtp.sendgrid.net",
    //   port: 587,
    //   auth: {
    //     user: "apikey",
    //     pass: SENDGRID_KEY,
    //   },
    // };
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vamseekrishna.private@gmail.com",
        pass: GMAIL_APP_PASSWORD,
      },
    });
    transporter.sendMail(emailDetails);
    console.log("Email sent");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { EmailHelper };
