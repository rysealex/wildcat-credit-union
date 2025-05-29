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

// POST /api/users/check - check if user exists by email and password
router.post('/users/check', (req, res) => {
    const { email, password } = req.body;
    userModel.userExists(email, password)
        .then(exists => {
            if (exists) {
                res.status(200).json({ exists: true });
            } else {
                res.status(404).json({ exists: false });
            }
        })
        .catch(error => res.status(500).json({ error: 'Failed to check user existence' }));
});

module.exports = router;