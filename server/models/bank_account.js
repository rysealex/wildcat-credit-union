const { db } = require('../index'); // import db connection from index.js
const { get } = require('../routes/user');

const bankAccountModel = {
	// function to get all bank accounts
	getAllBankAccounts: async () => {
		try {
			const [rows, fields] = await db.promise().query('SELECT * FROM bank_account');
			return rows;
		} catch (error) {
			console.error('Error fetching bank accounts:', error);
			throw error;
		}
	},
	// function to get bank account balance by ssn
	getBankAccountBalanceBySSN: async (ssn) => {
		try {
			const [rows, fields] = await db.promise().query('SELECT balance FROM bank_account WHERE ssn = ?', [ssn]);
			return rows;
		} catch (error) {
			console.error('Error fetching bank account by ssn:', error);
			throw error;
		}
	}
};

module.exports = bankAccountModel;