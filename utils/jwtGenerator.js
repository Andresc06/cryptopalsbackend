import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

// JWT Generator
function jwtGenerator(user_id) {
  // Payload
  const payload = {
    user: user_id,
  };

  // Return the JWT token
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "10m" });
}

export default jwtGenerator;
