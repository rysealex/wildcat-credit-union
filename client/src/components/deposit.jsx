import React, { useState, useEffect } from 'react';

const Deposit = () => {
	// use state to manage deposit amount and success message
	const [depositAmount, setDepositAmount] = useState('');
	
	// handle the deposit form submission
	const handleDeposit = async (e) => {
		e.preventDefault();

		// get the user's SSN from local storage
		const currUserSsn = localStorage.getItem('curr_user_ssn');

		// create the transaction object
		const transactionData = {
			ssn: currUserSsn, // use the actual user SSN from local storage
			date: new Date().toISOString().slice(0, 10), // current date in YYYY-MM-DD format
			transaction_type: 'deposit',
			transaction_amount: parseFloat(depositAmount),
		};

		try {
			// step 1: add transaction to transaction history
			const transactionResponse = await fetch('http://localhost:5000/api/transaction_history', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(transactionData),
			});
			if (!transactionResponse.ok) {
				throw new Error('Failed to deposit amount');
			}

			// step 2: update bank account balance
			const bankAccountResponse = await fetch(`http://localhost:5000/api/bank_accounts/${transactionData.ssn}/funds`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ 
					ssn: transactionData.ssn, 
					amount: transactionData.transaction_amount 
				}),
			});
			if (!bankAccountResponse.ok) {
				throw new Error('Failed to update bank account balance');
			}
			// clear the deposit amount input field
			setDepositAmount('');
		} catch (error) {
			console.error('Error during deposit:', error);
			alert('Deposit failed. Please try again.');
		}
	};

	return (
		<div>
			<h2>Deposit Money</h2>
			<form onSubmit={handleDeposit}>
				<label htmlFor="depositAmount">Amount to Deposit:</label>
				<input
					type="number"
					id="depositAmount"
					value={depositAmount}
					onChange={(e) => setDepositAmount(e.target.value)}
					required
				/>
				<button type="submit">Deposit</button>
			</form>
		</div>
	);

};

export default Deposit;