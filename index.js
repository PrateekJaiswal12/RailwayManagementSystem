import express from 'express';
import { configDotenv } from 'dotenv';
import userRoutes from './routes/user.route.js';

configDotenv();

const app = express();
app.use(express.json());


// routes
app.use('user', userRoutes);


// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});