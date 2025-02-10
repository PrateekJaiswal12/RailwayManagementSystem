import express from 'express';
import { addTrain, updateTrainSeats } from '../controllers/admin.controller.js';
import { verifyApiKey } from '../middlewares/apiKey.middleware.js';


const router = express.Router();

// routes
router.put('/update-seats/:trainId', verifyApiKey, updateTrainSeats);
router.post('/addTrain', verifyApiKey, addTrain);

export default router;