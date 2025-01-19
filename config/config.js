import dotenv from "dotenv";
dotenv.config();

export const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  HOST: process.env.HOST,
  AUTH_USER: process.env.AUTH_USER,
  AUTH_PASS: process.env.AUTH_PASS,
  URL: process.env.URLS,
  BASE_URL: process.env.BASE_URL,
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APISECRET,
};
