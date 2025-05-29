const express = require('express');
const router = express.Router();
const bankAccountModel = require('../models/bank_account'); // import user model

// GET /api/bank_accounts - get all bank accounts
router.get('/bank_accounts', (req, res) => {
	bankAccountModel.getAllBankAccounts()
		.then(accounts => res.json(accounts))
		.catch(error => res.status(500).json({ error: 'Failed to fetch bank accounts' }));
});

// GET /api/bank_accounts/:ssn - get bank account balance by ssn
router.get('/bank_accounts/:ssn', async (req, res) => {
	const { ssn } = req.params;
	try {
		const account = await bankAccountModel.getBankAccountBalanceBySSN(ssn);
		// check if account exists
		if (account && account.length > 0) {
			res.json(account[0]);
		} else {
			res.status(404).json({ error: 'Bank account not found' });
		}
	} catch (error) {
		res.status(500).json({ error: `Failed to retrieve bank account balance for SSN ${ssn}` });
	}
});

// POST /api/bank_accounts - add a new bank account
router.post('/bank_accounts', (req, res) => {
	const accountData = req.body; // get account data from request body
	bankAccountModel.addBankAccount(accountData)
		.then(newAccount => res.status(201).json(newAccount))
		.catch(error => res.status(500).json({ error: 'Failed to add bank account' }));
});

// POST /api/bank_accounts/:ssn/funds - add funds to a bank account
router.post('/bank_accounts/:ssn/funds', async (req, res) => {
	const { ssn } = req.params;
	const { amount } = req.body; // get amount from request body
	try {
		const affectedRows = await bankAccountModel.addFundsToBankAccount(ssn, amount);
		if (affectedRows > 0) {
			res.status(200).json({ message: 'Funds added successfully' });
		} else {
			res.status(404).json({ error: 'Bank account not found' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to add funds to bank account' });
	}
});

module.exports = router;