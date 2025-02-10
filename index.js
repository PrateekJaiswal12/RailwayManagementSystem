import express from 'express'
import { configDotenv } from 'dotenv'


configDotenv();

const app = express();
app.use(express.json());



// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});