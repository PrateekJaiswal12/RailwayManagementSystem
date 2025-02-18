import { configDotenv } from "dotenv";

configDotenv();
// Verification of secretApiKey

export const verifyApiKey = (req, res, next) => {
    const ApiKey = process.env.APIKEY;
    const providedApiKey = req.headers['x-api-key'];

    if (ApiKey !== providedApiKey) {
        return res.status(403).json({ message: 'Unauthorized request: Forbiden' });
    }

    next();
};