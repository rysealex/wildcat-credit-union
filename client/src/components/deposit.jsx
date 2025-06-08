import React, { useState, useEffect, useRef } from 'react';

const Deposit = ({ onTransactionSuccess }) => {
	// use state to manage deposit amount and success message
	const [depositAmount, setDepositAmount] = useState('');
	// use state to manage the success message
	const [successMessage, setSuccessMessage] = useState('');
	// use state to manage the error message
	const [errorMessage, setErrorMessage] = useState('');
	// use state to disable the input/button while processing the deposit
	const [isProcessing, setIsProcessing] = useState(false);

	// reference to the deposit amount input field
	const depositAmountInputRef = useRef(null);

	// handle the deposit form submission
	const handleDeposit = async (e) => {
		e.preventDefault();

		// clear previous messages
        setSuccessMessage('');
        setErrorMessage('');

		// prevent input/clicks while processing
        if (isProcessing) {
            return;
        }
        setIsProcessing(true);

		// get the user's SSN from local storage
		const currUserSsn = localStorage.getItem('curr_user_ssn');

		// create the transaction object
		const transactionData = {
			ssn: currUserSsn, // use the actual user SSN from local storage
			date: new Date().toISOString().slice(0, 10), // current date in YYYY-MM-DD format
			transaction_type: 'Deposit',
			transaction_amount: parseFloat(depositAmount),
		};

		try {
			// step 1. check if the current user can perform the deposit (check against daily limits)
			const depositLimitsResponse = await fetch(
				`http://localhost:5000/api/transaction_history/check-deposit-limits/${currUserSsn}/${depositAmount}`);
				// check for API response
				if (!depositLimitsResponse.ok) {
					const errorData = await depositLimitsResponse.json();
                	throw new Error(errorData.message || 'Failed to verify deposit limits.');
            	}
				
				// get the result from the API response
				const checkResult = await depositLimitsResponse.json();
				if (!checkResult.allowed) {
					// if the check returns false, display the message from the backend
					setErrorMessage(checkResult.message);
					setIsProcessing(false);
					return; // stop deposit from proceeding
            	}

			// step 2: add transaction to transaction history
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

			// step 3: update bank account balance
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
			// show success message
			setSuccessMessage(`Successfully deposited $${transactionData.transaction_amount}!`);
			// call the callback to update the balance in the parent
			if (onTransactionSuccess) {
                onTransactionSuccess();
            }
			// reset the deposit form after 5 seconds
            setTimeout(() => {
				// clear the deposit amount input field
				setDepositAmount('');
				// clear the success message
				setSuccessMessage('');
                // reset processing state
                setIsProcessing(false);
            }, 5000);

		} catch (error) {
			console.error('Error during deposit:', error);
			setErrorMessage('Deposit failed. Please try again.');
			// focus the deposit amount input field for user convenience
			depositAmountInputRef.current.focus();
			setIsProcessing(false);
		}
	};

	return (
		<div >
			<h2 style={{ textAlign: 'center' }}>Deposit Funds</h2>
			<form onSubmit={handleDeposit}>
				<label htmlFor="depositAmount" style={{ textAlign: 'center' }}>Amount to Deposit:</label>
				<input
					type="number"
					min='1.00'
					max='500.00'
					step='0.01'
					id="depositAmount"
					value={depositAmount}
					onChange={(e) => setDepositAmount(e.target.value)}
					required
					ref={depositAmountInputRef}
					disabled={isProcessing}
				/>
				{errorMessage && <p 
					className="error-message"
				>
					{errorMessage}
				</p>}
				{successMessage && <p className="success-message">{successMessage}</p>}
				<button type="submit" disabled={isProcessing}>Deposit</button>
			</form>
		</div>
	);

};

export default Deposit;