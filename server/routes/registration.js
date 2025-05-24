const express = require('express');
const router = express.Router();
const userModel = require('../models/user'); // import user model
const bankAccountModel = require('../models/bank_account'); // import bank account model

// POST /api/registration - register a new user and create a bank account
router.post('/registration', async (req, res) => {
	const userData = req.body; // get user data from request body
	try {
		// step 1: create the bank account record first
		const newBankAccount = await bankAccountModel.addBankAccount({
			ssn: userData.ssn, // use the ssn from user data
			balance: 500.00 // default balance set to 500.00
		});
		console.log('New bank account created:', newBankAccount);
		// step 2: if bank account creation is success, then create the user record
		const newUser = await userModel.addUser(userData);
		console.log('New user created:', newUser);

		res.status(201).json({
			message: 'User registered successfully',
			user: newUser,
			bankAccount: newBankAccount
		});
	} catch (error) {
		console.error('Error during registration:', error);
		res.status(500).json({ error: 'Failed to register user and bank account' });
	}
});

module.exports = router;