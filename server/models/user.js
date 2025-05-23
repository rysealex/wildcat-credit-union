const { db } = require('../index'); // import db connection from index.js

const userModel = {
	// function to get all users
	getAllUsers: async () => {
		try {
			const [rows, fields] = await db.promise().query('SELECT * FROM user');
			return rows;
		} catch (error) {
			console.error('Error fetching users:', error);
			throw error;
		}
	}
};

module.exports = userModel;