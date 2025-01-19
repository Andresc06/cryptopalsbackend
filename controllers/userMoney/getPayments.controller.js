import Users from '../../models/Users.js'


export const getPayments = async (req, res) => {

  try {

    const user = await Users.findOne({ email: req.params.userEmail });

    const userPayments = user.payments

    res.json(userPayments);

  } catch (error) {
    res.status(400).send("An error occured");
  }
}