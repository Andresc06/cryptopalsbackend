import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import jwsRoutes from '../routes/jws.routes.js'
import marketRoutes from '../routes/market.routes'
import { connectDB } from '../config/db.js';


const app = express();

//MIDDLEWARE

app.use(express.json()) // for parsing application/json
app.use(cors()) // for enabling cors

// Connect to the database
connectDB();

// ROUTES
app.use('/auth', jwsRoutes);
app.use('/wallet', marketRoutes);

module.exports.handler = serverless(app);