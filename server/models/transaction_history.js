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
	},
	// function to check if a deposit is allowed based on the 3 daily limit and $500 daily total
	checkDepositLimits: async (ssn, amount) => {
		try {
			// step 1. query to check the current daily amount
			const [amountRows] = await pool.query(
                `SELECT SUM(transaction_amount) AS total_deposited_today
                 FROM transaction_history
                 WHERE ssn = ?
                   AND transaction_type = 'Deposit'
                   AND date = CURDATE()`,
                [ssn]
            );
			const totalDepositedToday = amountRows[0].total_deposited_today || 0;

			// step 2. check if the total deposited today and new amount are greater than the $500 daily limit
			if ((totalDepositedToday + amount) > 500) {
				return { allowed: false, message: 'Daily deposit limit of $500 exceeded.' };
			}

			// step 3. query to check the current amount of deposits
			const [countRows] = await pool.query(
                `SELECT COUNT(*) AS deposit_count_today
                 FROM transaction_history
                 WHERE ssn = ?
                   AND transaction_type = 'Deposit'
                   AND date = CURDATE()`,
                [ssn]
            );
			const depositCountToday = countRows[0].deposit_count_today;

			// step 4. check if the daily deposit today is greater than the limit of 3
			if (depositCountToday >= 3) {
                return { allowed: false, message: 'You have reached your daily limit of 3 deposits.' };
            }

			// return true if deposit does not exceed the daily limits
			return { allowed: true };

		} catch(error) {
			console.error('Error checking deposit limits:', error);
            throw error;
		}
	},
	// function to check if a withdrawal is allowed based on the 3 daily limit and $500 daily total
	checkWithdrawalLimits: async (ssn, amount) => {
		try {
			// step 1. query to check the current daily amount
			const [amountRows] = await pool.query(
                `SELECT SUM(transaction_amount) AS total_withdrawal_today
                 FROM transaction_history
                 WHERE ssn = ?
                   AND transaction_type = 'Withdrawal'
                   AND date = CURDATE()`,
                [ssn]
            );
			const totalWithdrawalToday = amountRows[0].total_withdrawal_today || 0;

			// step 2. check if the total withdrawals today and new amount are greater than the $500 daily limit
			if ((totalWithdrawalToday + amount) > 500) {
				return { allowed: false, message: 'Daily withdrawal limit of $500 exceeded.' };
			}

			// step 3. query to check the current amount of withdrawals
			const [countRows] = await pool.query(
                `SELECT COUNT(*) AS withdrawal_count_today
                 FROM transaction_history
                 WHERE ssn = ?
                   AND transaction_type = 'Withdrawal'
                   AND date = CURDATE()`,
                [ssn]
            );
			const withdrawalCountToday = countRows[0].withdrawal_count_today;

			// step 4. check if the daily withdrawal today is greater than the limit of 3
			if (withdrawalCountToday >= 3) {
                return { allowed: false, message: 'You have reached your daily limit of 3 withdrawals.' };
            }

			// return true if withdrawal does not exceed the daily limits
			return { allowed: true };

		} catch(error) {
			console.error('Error checking withdrawal limits:', error);
            throw error;
		}
	},
};

module.exports = TransactionHistory;