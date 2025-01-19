import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator.js";

// Login User
export const loginUser = async (req, res) => {
  try {
    // 1 Destructure req.body

    let { email, password } = req.body;

    email = email.toLowerCase();

    // 2 Check if user exists (if not, throw error)

    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(401).json("Password or email is incorrect");
    }

    // 3 Check if incoming password is the same as the db

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json("Password or email is incorrect");
    }

    // 4 Check if user is verified

    if (user.verified === false) {
      return res.status(401).json("Please verify your account");
    }

    // 5 Give user the jwt token

    const token = jwtGenerator(user._id);

    res.json({ token, email, user });
  } catch (error) {
    console.error(error.message);
  }
};
