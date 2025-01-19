import { config } from "../config/config";
import Users from "../models/Users";
const { Spot } = require("@binance/connector");

export const verifyPayment = async (req, res) => {
  try {
    let { email, year, month, day, hour, minute, second, quantity, crypto } =
      req.body;

    if (!crypto) return res.status(400).json("Choose a Crypto");

    //Get user
    const user = await Users.findOne({ email: email });

    // Get all users
    const allUsers = await Users.find({});

    const client = new Spot(
      `${config.APIKEY}`,
      `${config.APISECRET}`
    );

    // Get the history of payments
    let history = await client.payHistory();

    let found = false;

    // Get the timestamp of input data
    let date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    let timestamp = date.getTime();

    let i = 0;
    let idx = 0;

    let deposits = history.data.data;
    let depTimestamp = 0;

    // Find the payment
    do {
      depTimestamp = Math.trunc(deposits[i].transactionTime / 1000) * 1000;
      if (
        depTimestamp == timestamp && deposits[i].amount == quantity
      ) {
        idx = i;
        found = true;
      }
      i++;
    } while (found == false);

    // Check if the payment is in the history
    if (found == false)
      return res.status(400).json("Not found. Verify your data");

    // Check if the currency is the same
    let CurrencyFlg = true;
    let same = false;

    if (deposits[idx].currency != crypto) {
      CurrencyFlg = false;
      return res.status(400).json("Not found. Verify your data");
    }

    // Check if the payment is already registered
    same = allUsers.some(user =>
      user.deposits.some(deposit =>
        deposit.transactionId === deposits[idx].transactionId
      )
    );

    if (same) return res.status(400).json("Payment already registered");

    if (CurrencyFlg && found) {
      user.deposits.push(deposits[idx]);

      // Update the user with the new deposit
      await Users.updateOne({ email: email }, { deposits: user.deposits });

      return res.status(200).json("payment verified sucessfully");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
