const express = require('express');
const router = express.Router();
const userModel = require('../models/user'); // import user model
const bankAccountModel = require('../models/bank_account'); // import bank account model
const transactionModel = require('../models/transaction_history'); // import transaction history model

// POST /api/registration - register a new user, create a new bank account, and add a welcome transaction
router.post('/registration', async (req, res) => {
	// get the user data from the request
	const userData = req.body;
	try {
		// step 0: pre-validation check for unique phone number and email
		const existingUserByPhone = await userModel.getUserByPhoneNumber(userData.phone_number);
		if (existingUserByPhone) {
			return res.status(409).json({ error: 'Phone number already registered' });
		}
		const existingUserByEmail = await userModel.getUserByEmail(userData.email);
		if (existingUserByEmail) {
			return res.status(409).json({ error: 'Email already registered' });
		}
		// step 1: create the bank account record first
		const newBankAccount = await bankAccountModel.addBankAccount({
			ssn: userData.ssn, // use the ssn from user data
			balance: 500.00 // default balance set to 500.00
		});
		// step 2: if bank account creation is success, then create the user record
		const newUser = await userModel.addUser(userData);

		// step 3: if user creation is success, add a welcome transaction ($500.00) to the bank account
		const welcomeTransaction = {
			ssn: userData.ssn,
			date: new Date().toISOString().slice(0, 10), // current date in YYYY-MM-DD format
			transaction_type: 'Welcome',
			transaction_amount: 500.00 // welcome amount
		};
		// call the addTransaction method from transactionModel
        const welcomeTransactionResult = await transactionModel.addTransaction(welcomeTransaction);
		
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