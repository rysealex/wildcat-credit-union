const pool = require('../index'); // import pool connection from index.js

const bankAccountModel = {
	// function to get all bank accounts
	getAllBankAccounts: async () => {
		try {
			const [rows, fields] = await pool.query('SELECT * FROM bank_account');
			return rows;
		} catch (error) {
			console.error('Error fetching bank accounts:', error);
			throw error;
		}
	},
	// function to get bank account balance by ssn
	getBankAccountBalanceBySSN: async (ssn) => {
		try {
			const [rows, fields] = await pool.query('SELECT balance FROM bank_account WHERE ssn = ?', [ssn]);
			return rows;
		} catch (error) {
			console.error('Error fetching bank account by ssn:', error);
			throw error;
		}
	},
	// function to add a new bank account
	addBankAccount: async (accountData) => {
		try {
			const { ssn, balance } = accountData;
			// construct the SQL query to insert a new bank account
			const accountToInsert = {
				ssn: ssn,
				balance: 500.00 // default balance set to 500.00
			};
			// execute the query
			const [result] = await pool.query('INSERT INTO bank_account SET ?', accountToInsert);
			// return the inserted bank account
			return {
				id: result.insertId,
				...accountToInsert
			};
		} catch (error) {
			console.error('Error adding bank account:', error);
			throw error;
		}
	},
	// function to add funds to a bank account
	addFundsToBankAccount: async (ssn, amount) => {
		try {
			// update the balance of the bank account
			const [result] = await pool.query(
				'UPDATE bank_account SET balance = balance + ? WHERE ssn = ?', 
				[amount, ssn]
			);
			return result.affectedRows;
		} catch (error) {
			console.error('Error adding funds to bank account:', error);
			throw error;
		}
	},
	// function to subtract funds from a bank account
	subtractFundsFromBankAccount: async (ssn, amount) => {
		try {
			// update the balance of the bank account
			const [result] = await pool.query(
				'UPDATE bank_account SET balance = balance - ? WHERE ssn = ?', 
				[amount, ssn]
			);
			return result.affectedRows;
		} catch (error) {
			console.error('Error subtracting funds from bank account:', error);
			throw error;
		}
	}
};

module.exports = bankAccountModel;