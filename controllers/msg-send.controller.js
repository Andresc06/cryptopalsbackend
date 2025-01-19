// import client from "twilio";
import Users from "../models/Users.js";
import { sendCodeEmail } from "../utils/payments-email.js";

export const msgSend = async (req, res) => {
  // This function sends a validation code to the user's email
  try {
    const user = await Users.findOne({ email: req.params.userEmail });

    let code = parseInt(Math.random() * 1000000);

    let codeToString = code.toString();

    code = `Hello <b>${user.name}</b>!! Your validation code is <b>${codeToString}</b>.`;


    // Twilio uses a trial account, since the US has restriction on sending local messages, the code is commented out
    // let msg = new client(
    //   "AC60e04e3886cb759beddf938488a6d7d3",
    //   "d214d64e43a81ddf9211cf0ae3b2c82d"
    // );

    // await msg.messages
    //   .create({
    //     to: user.phone,
    //     from: "+19143506088",
    //     body: `Your validation code is ${code}`,
    //   })
    //   .then((message) => console.log(message.sid));


    await sendCodeEmail(user.email, code);

    await Users.updateOne({ _id: user._id }, { temp: codeToString });

    res.send("A validation code has been sent to your email");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("server error");
  }
};
