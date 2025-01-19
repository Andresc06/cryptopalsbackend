import Users from "../../models/Users";
import { Spot } from "@binance/connector";
import { config } from "../../config/config";
import axios from "axios";
import { sendEmailPayment } from "../../utils/payments-email";

// Do orders (Buy or Sell)
export const doOrders = async (req, res) => {
  try {

    // Destructure req.body
    let { email, quantity, side, exchange } = req.body;


    // Find user by email
    const user = await Users.findOne({ email: email });

    // Get the currency
    let currency = exchange.replace("USDT", "");

    // if the user buys, check if the user has enough funds
    if (side == "BUY") {
      if (Number(user.wallet[0].USD) < quantity)
        return res.status(400).json("Not enough funds");
    }

    // if the user sells, check if the user has enough funds
    if (side == "SELL") {
      if (currency == "BUSD") {
        if (Number(user.wallet[0].BUS) < quantity)
          return res.status(400).json("Not enough funds");
      }

      if (currency == "BNB") {
        if (Number(user.wallet[0].BNB) < quantity)
          return res.status(400).json("Not enough funds");
      }

      if (currency == "ETH") {
        if (Number(user.wallet[0].ETH) < quantity)
          return res.status(400).json("Not enough funds");
      }
    }

    const client = new Spot(
      `${config.APIKEY}`, `${config.APISECRET}`, { baseURL: `${config.BASE_URL}` }
    );

    let price = await client.tickerPrice(exchange);

    price = price.data.price;

    price = Number(price);

    let qucrypto;

    if (side == "BUY") qucrypto = Number(quantity) / price;
    else qucrypto = quantity;

    // Since BINANCE API doesn't allow to buy/sell from/to market in the state of TEXAS, we will use the following code to simulate the order
    // let order = await client.newOrder(exchange, side, "MARKET", {
    //   quantity: qucrypto,
    // });

    if (side == "BUY") {
      side = "BUY FROM MARKET";
      // 0.1% fee for buying from market in binance
      qucrypto = qucrypto - qucrypto * 0.001;
    } else {
      {
        side = "SELL TO MARKET";
        // 0.1% fee for buying from market in binance
        qucrypto = qucrypto - qucrypto * 0.001;
      }
    }

    // if ((order.status = "FILLED")) {
    if (true) {
      let date = new Date();

      let paymentUser;
      let sellUser;

      if (side == "BUY FROM MARKET") {
        paymentUser = {
          quantity: qucrypto,
          fastpay: "N/A",
          currency: currency,
          user: "BUY FROM MARKET",
          date: date,
        };

        sellUser = {
          quantity: -quantity,
          fastpay: "N/A",
          currency: "USD",
          user: "SELL TO MARKET",
          date: date,
        };

        user.payments.push(paymentUser);
        user.payments.push(sellUser);

        await Users.updateOne({ _id: user._id }, { payments: user.payments });
      }

      if (side == "SELL TO MARKET") {
        paymentUser = {
          quantity: -quantity,
          fastpay: "N/A",
          currency: currency,
          user: "SELL TO MARKET",
          date: date,
        };

        sellUser = {
          quantity: qucrypto,
          fastpay: "N/A",
          currency: "USD",
          user: "BUY FROM MARKET",
          date: date,
        };

        user.payments.push(paymentUser);
        user.payments.push(sellUser);

        await Users.updateOne({ _id: user._id }, { payments: user.payments });
      }

      if (side == "BUY FROM MARKET") {
        const message = `Hello <bold>${user.name}</bold>!! receive a cordial greeting from this incredible team. We noticed that you BOUGHT some cryptos, here you have the information:<br><br>
                         
                         <bold>Crypto Info:</bold>
                         <li>💸 <bold>Amount</bold>: ${qucrypto}</li>
                         <li>💱 <bold>Currency</bold>: ${currency}</li>
                         <li>📆 <bold>Date</bold>: ${date}</li>
                         `;
        await sendEmailPayment(email, message);
      }

      if (side == "SELL TO MARKET") {
        const message = `Hello <bold>${user.name}</bold>!! receive a cordial greeting from this incredible team. We noticed that you SELL some cryptos, here you have the information:<br><br>
                                         
                                         <bold>Crypto Info:</bold>
                                         <li>💸 <bold>Amount</bold>: -${quantity}</li>
                                         <li>💱 <bold>Currency</bold>: ${currency}</li>
                                         <li>📆 <bold>Date</bold>: ${date}</li>
                                         `;
        await sendEmailPayment(email, message);
      }

      // update the user's wallet
      await axios.get(`${config.URL}/wallet/balance/${email}`);

      return res.status(200).json("Order Completed Successfully");
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
