import Users from "../models/Users.js";

// Change Phone
export const changePhone = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await Users.findOne({ email: email });

    if (!user) return res.status(400).send("Email not found");

    await Users.updateOne({ _id: user._id }, { phone: phone });

    res.send("Phone changed");
  } catch (error) {
    res.status(400).send("An error occured");
  }
};
