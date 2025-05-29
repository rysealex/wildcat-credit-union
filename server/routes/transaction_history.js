const express = require('express');
const router = express.Router();
const transactionHistoryModel = require('../models/transaction_history'); // import transaction history model

// GET /api/transaction_history/:ssn - get all transactions for a user
router.get('/transaction_history/:ssn', async (req, res) => {
    const ssn = req.params.ssn; // get ssn from request parameters
    try {
        // fetch all transactions for the user
        const transactions = await transactionHistoryModel.getAllTransactions(ssn);
        console.log('Transactions fetched:', transactions);
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
        console.log('New transaction added with ID:', newTransactionId);
        res.status(201).json({ id: newTransactionId });
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Failed to add transaction' });
    }
});

module.exports = router;