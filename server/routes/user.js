const express = require('express');
const router = express.Router();
const userModel = require('../models/user'); // import user model

// GET /api/users - get all users
router.get('/users', (req, res) => {
    userModel.getAllUsers()
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ error: 'Failed to fetch users' }));
});

// POST /api/users - add a new user
router.post('/users', (req, res) => {
    const userData = req.body; // get user data from request body
    userModel.addUser(userData)
        .then(newUser => res.status(201).json(newUser))
        .catch(error => res.status(500).json({ error: 'Failed to add user' }));
});

// POST /api/users/check - check if user exists by email and password and return the user ssn
router.post('/users/check', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. find the user by email and password
        const user = await userModel.userExists(email, password);
        if (user) {
            // 2. user exists, return the user ssn
            res.status(200).json({ exists: true, ssn: user.ssn });
        } else {
            // 3. user does not exist
            res.status(404).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to check user existence' });
    }
});

module.exports = router;