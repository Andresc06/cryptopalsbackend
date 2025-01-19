import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// Middleware to verify the token
const auth = async (req, res, next) => {
    try {
        // Obtaining the token from the header
        const jwtToken = req.header('token');

        // If there is no token, user is not authorized
        if (!jwtToken) {
            return res.status(403).json({ msg: 'authorization denied' });
        }

        // Verify the token
        const payload = jwt.verify(jwtToken, config.jwtSecret);

        // Assign the user to the request
        req.user = payload.user;

        // Continue with the request
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default auth;
