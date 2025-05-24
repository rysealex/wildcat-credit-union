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

module.exports = router;