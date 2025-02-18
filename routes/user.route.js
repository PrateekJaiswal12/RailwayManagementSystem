import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { getBookingDetails, getSeatAvailability, reserveSeat } from "../controllers/user.controller.js"
import authMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);

// Rest of the user routes
router.get('/availability', getSeatAvailability);
router.post('/book', authMiddleware, reserveSeat);
router.get('/getAllBookings', authMiddleware, getBookingDetails);

export default router;