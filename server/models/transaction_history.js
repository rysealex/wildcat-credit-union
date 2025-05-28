const pool = require('../index'); // import pool connection from index.js

const TransactionHistory = {
	// function to get all transactions for a user
	getAllTransactions: async (ssn) => {
		try {
			const [rows, fields] = await pool.query(
				'SELECT date, transaction_type, transaction_amount FROM transaction_history WHERE ssn = ?', [ssn]
			);
			return rows;
		} catch (error) {
			console.error('Error fetching transactions:', error);
			throw error;
		}
	},
	// function to add a new transaction
	addTransaction: async (transactionDetails) => {
		try {
			const { ssn, date, transaction_type, transaction_amount } = transactionDetails;
			// construct the SQL query to insert a new transaction (transaction_id is auto-incremented)
			const transactionToInsert = {
				ssn: ssn,
				date: date,
				transaction_type: transaction_type,
				transaction_amount: transaction_amount
			};
			// execute the query
			const [result] = await pool.query(
				'INSERT INTO transaction_history SET ?', transactionToInsert
			);
			// return the ID of the inserted transaction
			return result.insertId;
		} catch (error) {
			console.error('Error adding transaction:', error);
			throw error;
		}
	}
};

module.exports = TransactionHistory;