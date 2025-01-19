import { Router } from "express";
import valid from "../middleware/validInfo.js";
import { registerSchema, loginSchema } from "../validation/userValidation.js";
import { registerUser } from "../controllers/registerUser.controller.js";
import { loginUser } from "../controllers/loginUser.controller.js";
import auth from "../middleware/authorization.js";
import { verifiedToken } from "../controllers/verifiedToken.controller.js";
import { verifyEmail } from "../controllers/verifyEmail.controller.js";
import { changePassword } from "../controllers/changePassword.controller.js";
import { changeInfo } from "../controllers/changeInfo.controller.js";
import { sendUser } from "../controllers/sendUserInformation.controller";

const router = Router();

// REGISTER ROUTE
router.post("/register", valid(registerSchema), registerUser);
router.get("/verify/:bcryptPassword", verifyEmail);

// LOGIN ROUTE
router.post("/login", valid(loginSchema), loginUser);

// DASHBOARD
router.get("/verify", auth, verifiedToken);
router.post("/dashboard", sendUser);

// CHANGE PASSWORD
router.post("/changePassword", changePassword);
router.get("/verify/:userEmail/:bcryptPassword", changeInfo);

router.get("/", (req, res) => {
  res.json({
    hello: "world",
  });
});

export default router;
