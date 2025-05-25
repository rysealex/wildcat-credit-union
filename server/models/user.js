const pool = require('../index'); // import pool connection from index.js

const userModel = {
	// function to get all users
	getAllUsers: async () => {
		try {
			const [rows, fields] = await pool.query('SELECT * FROM user');
			return rows;
		} catch (error) {
			console.error('Error fetching users:', error);
			throw error;
		}
	},
	// function to add a new user
	addUser: async (userData) => {
		try {
			const { fname, lname, email, ssn, password, phone_number, account_number } = userData;
			// construct the SQL query to insert a new user
			const userToInsert = {
				fname: fname,
				lname: lname,
				email: email,
				ssn: ssn,
				password: password,
				phone_number: phone_number,
				account_number: account_number
			};
			// execute the query
			const [result] = await pool.query('INSERT INTO user SET ?', userToInsert);
			// return the inserted user
			return {
				id: result.insertId,
				...userToInsert
			};
		} catch (error) {
			console.error('Error adding user:', error);
			throw error;
		}
	}
};

module.exports = userModel;