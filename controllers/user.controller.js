import pool from '../db/db.conifg.js';
import { getTrainsByRoute } from '../models/train.model.js';
import Booking from '../models/booking.model.js';



// Getting available trains and their seats by source and destination
export const getSeatAvailability = async (req, res) => {
    const { source, destination } = req.query;

    if (!source || !destination) {
        return res.status(400).json({ message: 'Source and destination are required' });
    }

    try {
        const trains = await getTrainsByRoute(source, destination);

        if (trains.length === 0) {
            return res.status(404).json({ message: 'No trains available for the specified route' });
        }

        const availableTrains = trains
        .map(train => ({
            trainNumber: train.train_number,
            availableSeats: train.available_seats
        }))
        .filter(train => train.availableSeats > 0);

        res.status(200).json({
            available: availableTrains.length > 0,
            availableTrainCount: availableTrains.length,
            trains: availableTrains
        });
    } catch (error) {
        console.error('Error fetching seat availability:', err);
        res.status(500).json({ message: 'Error fetching seat availability', error: error.message });
    }
};



// Booking seats with transaction & locking mechanism
export const reserveSeat = async (req, res) => {
    const { trainId, seatsToBook } = req.body;
    const userId = req.user?.id;
    // console.log(req.user?.id);

    const connection = await pool.getConnection();
    try {
        console.log("Booking started");

        await connection.beginTransaction();
        console.log("Transaction started");

        const [train] = await connection.query('SELECT total_seats, available_seats FROM trains WHERE id = ? FOR UPDATE', [trainId]);

        if (!train.length) {
            console.log("Train not found");
            await connection.rollback();
            return res.status(404).json({ message: 'Train not found' });
        }

        const availableSeats = train[0].available_seats;
        if (availableSeats < seatsToBook) {
            console.log("Not enough seats available");
            await connection.rollback();
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Updating available seats
        await connection.query('UPDATE trains SET available_seats = available_seats - ? WHERE id = ?', [seatsToBook, trainId]);
        console.log("Seats updated");

        // res.status(200).json({user: req.user});
        await Booking.create(userId, trainId, seatsToBook, connection);
        console.log("Booking Done");

        await connection.commit();
        res.json({ message: 'Seats booked successfully' });
    } catch (error) {
        console.error("Error during booking:", error.message);
        await connection.rollback();
        res.status(500).json({ message: 'Error booking seats', error: error.message, req: req.user });
    } finally {
        connection.release();
    }
};



// All booking details for a user
export const getBookingDetails = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
        SELECT 
            b.id AS booking_id,
            b.seats AS number_of_seats,
            t.train_number,
            t.source,
            t.destination
        FROM bookings b
        JOIN trains t ON b.train_id = t.id
        WHERE b.user_id = ?
        `;

        const [rows] = await pool.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching booking details:', error.message);
        res.status(500).json({ message: 'Error fetching booking details' });
    }
};