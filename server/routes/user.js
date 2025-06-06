const express = require('express');
const router = express.Router();
const userModel = require('../models/user'); // import user model

// GET /api/users - get all users
router.get('/users', (req, res) => {
    userModel.getAllUsers()
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ error: 'Failed to fetch users' }));
});

// GET /api/users/ssn/:ssn - get user by ssn
router.get('/users/ssn/:ssn', async (req, res) => {
    const { ssn } = req.params;
    try {
        const user = await userModel.getUserBySSN(ssn);
        // check if user exists
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve user with ssn ${ssn}` });
    }
});

// GET /api/users/phone_number/:phone_number - get user by phone number
router.get('/users/phone_number/:phone_number', async (req, res) => {
    const { phone_number } = req.params;
    try {
        const user = await userModel.getUserByPhoneNumber(phone_number);
        // check if user exists
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve user with phone number ${phone_number}` });
    }
});

// GET /api/users/email/:email - get user by email
router.get('/users/email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userModel.getUserByEmail(email);
        // check if user exists
        if (user && user.length > 0) {
            res.json(user[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve user with email ${email}` });
    }
});

// POST /api/users - add a new user
router.post('/users', (req, res) => {
    const userData = req.body; // get user data from request body
    userModel.addUser(userData)
        .then(newUser => res.status(201).json(newUser))
        .catch(error => res.status(500).json({ error: 'Failed to add user' }));
});

// POST /api/users/check - check if user exists by email and password and return the user ssn and phone number
router.post('/users/check', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. find the user by email and password
        const user = await userModel.userExists(email, password);
        if (user.exists) {
            // 2. user exists, return the user ssn and phone number
            res.status(200).json({ 
                exists: true, 
                ssn: user.user.ssn, 
                phone_number: user.user.phone_number,
                login_attempts: user.user.login_attempts 
            });
        } else if (user.locked) {
            // 3. user does exist but the account is currently locked
             res.status(423).json({ 
                exists: false,
                message: user.message,
                login_attempts: user.login_attempts
            });
        } else {
            // 4. user not found or incorrect credentials
            res.status(401).json({ 
                exists: false,
                message: user.message || 'Invalid credentials. Please try again.',
                login_attempts: user.login_attempts
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to check user existence' });
    }
});

module.exports = router;