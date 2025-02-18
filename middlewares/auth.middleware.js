import jwt from "jsonwebtoken";
import { configDotenv } from 'dotenv';
// import {User} from "../models/user.model.js"

configDotenv();


const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    
    
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }
        res.status(401).json({ message: "Invalid token", error: error });
    }
};

export default authMiddleware;
