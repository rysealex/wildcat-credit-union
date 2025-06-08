const express = require('express');
const router = express.Router();
const transactionHistoryModel = require('../models/transaction_history'); // import transaction history model

// GET /api/transaction_history/:ssn - get all transactions for a user
router.get('/transaction_history/:ssn', async (req, res) => {
    const ssn = req.params.ssn; // get ssn from request parameters
    try {
        // fetch all transactions for the user
        const transactions = await transactionHistoryModel.getAllTransactions(ssn);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transaction history' });
    }
});

// POST /api/transaction_history - add a new transaction
router.post('/transaction_history', async (req, res) => {
    const transactionDetails = req.body; // get transaction details from request body
    try {
        // add the new transaction
        const newTransactionId = await transactionHistoryModel.addTransaction(transactionDetails);
        res.status(201).json({ id: newTransactionId });
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Failed to add transaction' });
    }
});

// GET /api/transaction_history/check-deposit-limits/:ssn/:amount - check if deposit can proceed
router.get('/transaction_history/check-deposit-limits/:ssn/:amount', async (req, res) => {
    // get the ssn and amount to deposit from current user
    const ssn = req.params.ssn;
    const amount = parseFloat(req.params.amount);
    try {
        // check the current user's deposit limits
        const result = await transactionHistoryModel.checkDepositLimits(ssn, amount);
        res.status(200).json(result); // returns { allowed: true } or { allowed: false, message: '...' }
    } catch(error) {
        console.error('Error checking deposit limits via API:', error);
        res.status(500).json({ allowed: false, message: 'Internal server error during limit check.' });
    }
});

// GET /api/transaction_history/check-withdrawal-limits/:ssn/:amount - check if withdrawal can proceed
router.get('/transaction_history/check-withdrawal-limits/:ssn/:amount', async (req, res) => {
    // get the ssn and amount to deposit from current user
    const ssn = req.params.ssn;
    const amount = parseFloat(req.params.amount);
    try {
        // check the current user's withdrawal limits
        const result = await transactionHistoryModel.checkWithdrawalLimits(ssn, amount);
        res.status(200).json(result); // returns { allowed: true } or { allowed: false, message: '...' }
    } catch(error) {
        console.error('Error checking withdrawal limits via API:', error);
        res.status(500).json({ allowed: false, message: 'Internal server error during limit check.' });
    }
});

module.exports = router;