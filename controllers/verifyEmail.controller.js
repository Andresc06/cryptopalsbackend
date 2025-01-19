import Users from '../models/Users'

export const verifyEmail = async (req, res) => {

  try {

    // This replacement is necessary because the bcrypt password has a slash
    let Password = req.params.bcryptPassword.replace(/slash/g, "/");

    // Find the user with the password
    const user = await Users.findOne({ password: Password });

    if (!user) return res.status(400).send("Invalid link");

    // Update the user to verified
    await Users.updateOne({ _id: user._id }, { verified: true });

    res.send("email verified sucessfully");

  } catch (error) {
    res.status(400).send("An error occured");
  }
}