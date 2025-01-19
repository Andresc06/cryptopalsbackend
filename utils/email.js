import nodemailer from "nodemailer";
import { config } from "../config/config";

export const sendEmail = async (email, text) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: `${config.AUTH_USER}`,
        pass: config.AUTH_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: "Cryptopals Team <" + `${config.AUTH_USER}` + ">",
      to: `${email}, ${config.AUTH_USER}`,
      subject: "Verification of your Cryptopals Account ✔",
      text: text,
    });

    return "Email sent";
  } catch (error) {
    console.log(error);
    return "Error sending email";
  }
};
