const pool = require('../index'); // import pool connection from index.js
const bcrypt = require('bcryptjs'); // import bcryptjs for password encryption

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
	// function to get user by ssn
	getUserBySSN: async (ssn) => {
		console.log('user model getUserBySSN called with:', ssn);
		try {
			const [rows, fields] = await pool.query('SELECT * FROM user WHERE ssn = ?', [ssn]);
			console.log("userModel: Query result for ssn:", rows);
			return rows.length > 0 ? rows[0] : null;
		} catch (error) {
			console.error('Error fetching user by ssn:', error);
			throw error;
		}
	},
	// function to get user by phone number
	getUserByPhoneNumber: async (phoneNumber) => {
		console.log('user model getUserByPhoneNumber called with:', phoneNumber);
		try {
			const [rows, fields] = await pool.query('SELECT * FROM user WHERE phone_number = ?', [phoneNumber]);
			console.log("userModel: Query result for phone number:", rows);
			return rows.length > 0 ? rows[0] : null;
		} catch (error) {
			console.error('Error fetching user by phone number:', error);
			throw error;
		}
	}, 
	// function to get user by email including the login_attmepts and lock_until attributes
	getUserByEmail: async (email) => {
		try {
			const [rows, fields] = await pool.query(
				'SELECT ssn, password, phone_number, email, login_attempts, lock_until FROM user WHERE email = ?', 
				[email]
			);
			return rows.length > 0 ? rows[0] : null;
		} catch (error) {
			console.error('Error fetching user by email:', error);
			throw error;
		}
	},
	// function to add a new user
	addUser: async (userData) => {
		try {
			const { fname, lname, email, ssn, password, phone_number, account_number } = userData;
			// hash the password using bcryptjs
			const saltRounds = 10; // salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);
			// construct the SQL query to insert a new user
			const userToInsert = {
				fname: fname,
				lname: lname,
				email: email,
				ssn: ssn,
				password: hashedPassword,
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
	},
	// function to update a user's login attempts and lock until attributes
	updateUserLoginAttempts: async (ssn, login_attempts, lock_until = null) => {
		try {
			await pool.query(
				'UPDATE user SET login_attempts = ?, lock_until = ? WHERE ssn = ?',
				[login_attempts, lock_until, ssn]
			);
			return true;
		} catch (error) {
			console.error('Error updating login attempts:', error);
            throw error;
		}
	},
	// function to check if a user exists by email and password with lockout logic
	userExists: async (email, plainTextPassword) => {
		try {
			// step 1. retrieve user from database by email only
			const user = await userModel.getUserByEmail(email);
			if (!user) {
				return { exists: false, message: 'Invalid credentials.' }; // no user found with current email
			}

			// step 2. check if account is currently locked
			const currentTime = new Date();
			if (user.lock_until && new Date(user.lock_until) > currentTime) {
				 const unlockTime = new Date(user.lock_until);
				const remainingMillis = unlockTime.getTime() - currentTime.getTime();
                const remainingMinutes = Math.ceil(remainingMillis / (1000 * 60)); // calculate the remaining minutes
                return { 
					exists: false, 
					locked: true, 
					message: `Account locked due to multiple failed login attempts. 
							Please try again in approximately ${remainingMinutes} minutes.` 
				};
			}

			// step 3. compare the plain text password with the stored hashed password
			const hashedPasswordFromDB = user.password;
			const passwordMatch = await bcrypt.compare(plainTextPassword, hashedPasswordFromDB);

			// if correct password, return the user object but exclude the password hash for security
			if (passwordMatch) {
				// step 4. successful login: reset login_attempts and lock_until
				await userModel.updateUserLoginAttempts(user.ssn, 0, null);
				const { password, login_attempts, lock_until, ...userWithoutSensitiveData } = user;

				return { exists: true, user: userWithoutSensitiveData };
			} else {
				// step 5. unsuccessful login: increment login_attempts and possibly lock the account
				const newAttempts = user.login_attempts + 1;
                let newLockUntil = null;
                const lockDurationMinutes = 10;

				// check if account should be locked (starts at 0 -> 4 = 5 attempts)
				if (newAttempts > 4) {
					// lock for 10 minutes from now
					newLockUntil = new Date(currentTime.getTime() + lockDurationMinutes * 60 * 1000);
				}

				// try to update the current user's login attempts
				await userModel.updateUserLoginAttempts(user.ssn, newAttempts, newLockUntil);
				// return invalid credentials for no account
				return { exists: false, message: 'Invalid credentials.' };
			}
		} catch (error) {
			console.error('Error checking user credentials:', error);
			throw error;
		}
	}
};

module.exports = userModel;