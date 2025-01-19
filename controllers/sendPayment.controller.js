import Users from "../models/Users";
import axios from "axios";
import { sendEmailPayment } from "../utils/payments-email";
import { config } from "../config/config";

export const sendPayment = async (req, res) => {
  try {
    let { email, receiver, quantity, taxes, currency, code } = req.body;

    email = email.toLowerCase();
    let payment = Number(quantity);

    const userSender = await Users.findOne({ email: email });

    const userReceiver = await Users.findOne({ email: receiver });

    // Check if the user enter the correct 2fa code
    if (userSender.temp != code) {
      return res.status(400).json("Not valid code");
    }

    // Check if the receiver email is valid
    if (!userReceiver) return res.status(400).json("Receiver email invalid");

    // Check if the user has enough funds
    const walletBalance = userSender.wallet[0][currency];
    if (walletBalance === undefined || Number(walletBalance) < payment) {
      return res.status(400).json("Not enough money");
    }

    if (userSender.email == receiver)
      return res.status(400).json("Can't send yourself");

    let date = new Date();

    // Create the payment object
    let paymentReceiver = {
      quantity: Number(quantity),
      fastpay: taxes,
      currency: currency.slice(0, 3),
      user: userSender.email,
      date: date,
    };
    let paymentSender = {
      quantity: -payment,
      fastpay: taxes,
      currency: currency.slice(0, 3),
      user: receiver,
      date: date,
    };

    userReceiver.payments.push(paymentReceiver);
    userSender.payments.push(paymentSender);

    await Users.updateOne(
      { _id: userSender._id },
      { payments: userSender.payments }
    );
    await Users.updateOne(
      { _id: userReceiver._id },
      { payments: userReceiver.payments }
    );

    const message = `Hello <bold>${userSender.name
      }</bold>!! Thank you for using our web app, receive a cordial greeting from this incredible team. We noticed that you have SENT a payment, here you have the information:<br><br>
                     
                     <bold>Payment Info:</bold> 
                     <li>💸 <bold>Amount</bold>: -${quantity}</li>
                     <li>📨 <bold>FastPay</bold>: ${taxes}</li>
                     <li>💱 <bold>Currency</bold>: ${currency.slice(0, 4)}</li>
                     <li>📩 <bold>To</bold>: ${receiver}</li>
                     <li>📆 <bold>Date</bold>: ${date}</li>
                     
    If you did not do this payment, please contact us at this email: cryp
                     `;

    const message2 = `Hello <bold>${userReceiver.name
      }</bold>!! receive a cordial greeting from this incredible team. We noticed that you have RECEIVED a payment, here you have the information:<br><br>
                     
                     <bold>Payment Info:</bold>
                     <li>💸 <bold>Amount</bold>: ${payment}</li>
                     <li>📨 <bold>FastPay</bold>: ${taxes ? "Yes" : "No"}</li>
                     <li>💱 <bold>Currency</bold>: ${currency.slice(0, 4)}</li>
                     <li>📩 <bold>From</bold>: ${userSender.email}</li>
                     <li>📆 <bold>Date</bold>: ${date}</li>
                     `;

    await sendEmailPayment(email, message);
    await sendEmailPayment(userReceiver.email, message2);
    await Users.updateOne({ _id: userSender._id }, { temp: 0 });

    // Update the user with the new balance
    await axios.get(`${config.URL}/wallet/balance/${userSender.email}`);

    res.status(200).json("payment successful");
  } catch (error) {
    res.status(400).json("An error occured");
  }
};
