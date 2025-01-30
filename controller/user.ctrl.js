const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
require('dotenv').config();

// Get all users
const GetUser = async (req, res) => {
    try {
        const data = await User.find();
        res.json({
            success: true,
            message: "All data",
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            data: err
        });
    }
};

// SignUp
const SignUp = async (req, res) => {
    try {
        const { username, password } = req.body;
        const normalizedUsername = username.toLowerCase();

        // Check if the username already exists
        const existingUser = await User.findOne({ username: normalizedUsername });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ ...req.body, username: normalizedUsername, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// SignIn
const SignIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // JWT token creation
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: process.env.JWT_EXPIRY_MS,
            sameSite: 'Strict', // or 'Lax' depending on requirements
        });

        res.json({
            success: true,
            message: 'User logged in successfully',
            token,
            user
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Logout
const Logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'User logged out successfully' });
};

// Delete User
const Delete = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update User
const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, fullName, dateOfBirth } = req.body;

        const updateData = {
            username,
            fullName,
            dateOfBirth
        };

        // If password is provided, hash it
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get User by ID
const GetbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Search Users by query
const GetQuery = async (req, res) => {
    try {
        const { query } = req.query;
        const user = await User.find({ fullName: { $regex: query, $options: 'i' } });

        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            data: user,
            message: "Users found"
        });
    } catch (error) {
        console.error('Error querying users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    GetQuery,
    GetUser,
    Delete,
    SignUp,
    SignIn,
    Logout,
    Update,
    GetbyId
};
