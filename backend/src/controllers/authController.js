// controllers/authController.js
import pkg from 'bcryptjs';
const { compare, genSalt, hash } = pkg;
import jwt from 'jsonwebtoken';

import sign  from 'jsonwebtoken';
import User from '../models/User.js'
import School from '../models/School.js';

import { User } from '../models/users.js';

export async function adminLogin(req, res) {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export async function schoolLogin(req, res) {
    const { username, password } = req.body;
    try {
        let school = await School.findOne({ username });
        if (!school) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await compare(password, school.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { school: { id: school.id } };
        sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export async function register(req, res) {
    const { names, email, username, password, role } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', user);
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            names,
            email,
            username,
            password,
            role,
            active
        });

        // Hash password
        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        // Save user to database
        await user.save();

        // Generate JWT token
        const payload = { user: { id: user.id, role: user.role } };
        sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) {
                console.error('JWT token generation error:', err);
                throw err;
            }
            console.log('User registered successfully:', user);
            res.json({ token });
        });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).send('Server Error');
    }
}
export const changeUsername = async (req, res) => {
    const { newUsername } = req.body;
    const userId = req.params.id ;
    
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { Username: newUsername }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Username updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating username:', error.message);
        res.status(500).json({ message: 'Failed to update username' });
    }
};


 export const checkActiveStatus = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.active) {
            return res.status(403).json({ message: 'Your account has been deactivated. Please contact the administrator.' });
        }

        req.user = user; // Attach the user object to the request for further processing
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};