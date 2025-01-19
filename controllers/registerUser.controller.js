import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import { config } from "../config/config";
import { sendEmail } from "../utils/email";

// Register User
export const registerUser = async (req, res) => {
  try {
    // 1 destructure req.body (name, email, password)

    let { name, email, password, phone } = req.body;

    email = email.toLowerCase();

    // 2 Check if user exists (if user exist then throw error)

    const user = await Users.findOne({ email: email });

    if (user) {
      return res.status(401).json("User already exists");
    }

    // 3. Bcrypt the password

    // saltRound is the number of rounds the data is processed for. The higher the number, the more secure the password is.
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4 Enter the new user inside our database

    const newUser = new Users({ name, email, password: bcryptPassword, phone });

    await newUser.save();

    // 5 Generate and send verification link

    const linkPassword = bcryptPassword.replace(/\//g, "slash");

    const message = `Hello Cryptopal!! Thank you for register, receive a cordial greeting from this incredible team. To start your adventure please open the following link to verify your account: ${config.URL}/auth/verify/${linkPassword} `;

    await sendEmail(email, message);

    res.send("An Email sent to your account please verify");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("server error");
  }
};
