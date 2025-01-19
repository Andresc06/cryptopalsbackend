import { Router } from "express";
import { changePhone } from "../controllers/changePhone.controller";
import { msgSend } from "../controllers/msg-send.controller";
import { sendPayment } from "../controllers/sendPayment.controller";
import { getDeposits } from "../controllers/userMoney/getDeposits.controller";
import { getPayments } from "../controllers/userMoney/getPayments.controller";
import { getSaldo } from "../controllers/userMoney/getSaldo.controller";
import { verifyPayment } from "../controllers/verifyPayment.controller";
import { doOrders } from "../controllers/cryptos/doOrders.controller";

const router = Router();

// MARKET
router.post("/payment", sendPayment);
router.post("/order", doOrders);

// LOAD ACCOUNT WITH MONEY
router.post("/loadAccount", verifyPayment);

// USER MONEY
router.get("/balance/:userEmail", getSaldo);
router.get("/deposits/:userEmail", getDeposits);
router.get("/payments/:userEmail", getPayments);
router.get("/msgsend/:userEmail", msgSend);

// USER
router.post("/changephone", changePhone);

export default router;
