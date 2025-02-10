import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



// register user
export const register = async(req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if(!existingUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User(name, email, hashedPassword);
            const savedUser = await newUser.save();

            console.log('User registered successfully, ID:', savedUser.insertId);
            res.json({ message: 'User registered successfully' });
        }

        return res.status(400).json({ message: 'User already exists with this email' });

    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Error registering user' });
    }
} 


// login user

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log('Password mismatch for email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful, token generated:', token);
        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Unable to log in at this moment' });
    }
};