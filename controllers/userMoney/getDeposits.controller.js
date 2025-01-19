import Users from '../../models/Users.js'


export const getDeposits = async (req, res) => {

  try {

    const user = await Users.findOne({ email: req.params.userEmail });

    const userDeposits = user.deposits

    res.send(userDeposits);

  } catch (error) {
    res.status(400).send("An error occured");
  }
}