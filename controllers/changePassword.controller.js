import { config } from '../config/config'
import Users from '../models/Users.js'
import bcrypt from "bcrypt";
import { sendEmail } from '../utils/email.js';

// Change Password
export const changePassword = async (req, res) => {

  try {

    // 1 Destructure req.body

    const { email, password } = req.body;

    // 2 Check if user exists (if not, throw error)
    const user = await Users.findOne({ email: email })

    if (!user) return res.status(400).send("Email not found");

    // 3 Bcrypt the password
    const salt = await bcrypt.genSalt(10);

    const bcryptPassword = await bcrypt.hash(password, salt);

    const userEmail = user.email;

    // 4 Generate and send verification link
    const linkPassword = bcryptPassword.replace(/\//g, "slash");

    // Send the email
    const message = `${config.URL}/auth/verify/${userEmail}/${linkPassword}`;

    await sendEmail(email, message);

    res.send("An Email was sent to your account please go to the link");

  } catch (error) {
    res.status(400).send("An error occured");
  }
}