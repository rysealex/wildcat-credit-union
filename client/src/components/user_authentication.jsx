import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// this component handles user authentication
const UserAuthentication = () => {

	// use navigate hook to programmatically navigate to other routes
	const navigate = useNavigate();	
	// function to handle navigation to different routes
	const handleNavigation = (url) => {
		navigate(url);
	};

	// state variables for user authentication
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [email, setEmail] = useState(''); 
	const [ssn, setSSN] = useState(''); 
	const [password, setPassword] = useState('');   
	const [phoneNumber, setPhoneNumber] = useState(''); 
	const [accountNumber, setAccountNumber] = useState('');

	// function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// create user data object
		const userData = {
			fname: fname,
			lname: lname,
			email: email,
			ssn: ssn,
			password: password,
			phone_number: phoneNumber,
			account_number: accountNumber
		};

		try {
			// send a POST request to the backend API to add a new user
			const response = await fetch('http://localhost:5000/api/registration', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json'
					},
					body: JSON.stringify(userData)
			});

			if (!response.ok) {
					throw new Error('Failed to add user');
			}

			const data = await response.json();
			console.log('User added successfully:', data);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>First Name:</label>
				<input type="text" value={fname} onChange={(e) => setFname(e.target.value)} required />
			</div>
			<div>
				<label>Last Name:</label>
				<input type="text" value={lname} onChange={(e) => setLname(e.target.value)} required />
			</div>
			<div>
				<label>Email:</label>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
			</div>
			<div>
				<label>SSN:</label>
				<input type="text" value={ssn} onChange={(e) => setSSN(e.target.value)} required />
			</div>
			<div>
				<label>Password:</label>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
			</div>
			<div>
				<label>Phone Number:</label>
				<input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
			</div>
			<div>
				<label>Account Number:</label>
				<input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
			</div>
			<button type="submit" onClick={() => handleNavigation('/display_account_info')}>Submit</button>
		</form>
	)
};

export default UserAuthentication;