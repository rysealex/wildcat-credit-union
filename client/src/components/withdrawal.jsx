import React, { useState, useEffect, useRef } from 'react';

const Withdrawal = ({ onTransactionSuccess }) => {
    // use state to manage withdrawal amount and success message
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    // use state to manage the success message
    const [successMessage, setSuccessMessage] = useState('');
    // use state to manage the error message
    const [errorMessage, setErrorMessage] = useState('');
    // use state to disable the input/button while processing the withdrawal
    const [isProcessing, setIsProcessing] = useState(false);

    // reference to the withdrawal amount input field
    const withdrawalAmountInputRef = useRef(null);

    // handle the withdrawal form submission
    const handleWithdrawal = async (e) => {
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

        // first check if user has enough balance for the withdrawal
        const balanceResponse = await fetch(`http://localhost:5000/api/bank_accounts/${currUserSsn}`);

        if (!balanceResponse.ok) {
            console.error('Failed to fetch bank account balance');
            setErrorMessage('Failed to fetch bank account balance. Please try again later.');
            setIsProcessing(false);
            return;
        }

        // parse the response to get the balance
        const balanceData = await balanceResponse.json();

        // check if the balance is sufficient for the withdrawal
        if (balanceData.balance < parseFloat(withdrawalAmount)) {
            setErrorMessage('Insufficient balance for this withdrawal.');
            withdrawalAmountInputRef.current.focus();
            setIsProcessing(false);
            return;
        }

        // after confirming that user has enough balance for withdrawal, create the transaction object
        const transactionData = {
            ssn: currUserSsn, // use the actual user SSN from local storage
            date: new Date().toISOString().slice(0, 10), // current date in YYYY-MM-DD format
            transaction_type: 'Withdrawal',
            transaction_amount: parseFloat(withdrawalAmount),
        };

        try {
            // step 1. check if the current user can perform the withdrawal (check against daily limits)
			const withdrawalLimitsResponse = await fetch(
				`http://localhost:5000/api/transaction_history/check-withdrawal-limits/${currUserSsn}/${withdrawalAmount}`);
				// check for API response
				if (!withdrawalLimitsResponse.ok) {
					const errorData = await withdrawalLimitsResponse.json();
                	throw new Error(errorData.message || 'Failed to verify withdrawal limits.');
            	}
				
				// get the result from the API response
				const checkResult = await withdrawalLimitsResponse.json();
				if (!checkResult.allowed) {
					// if the check returns false, display the message from the backend
					setErrorMessage(checkResult.message);
					setIsProcessing(false);
					return; // stop withdrawal from proceeding
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
                throw new Error('Failed to withdraw amount');
            }

            // step 3: update bank account balance
            const bankAccountResponse = await fetch(`http://localhost:5000/api/bank_accounts/${transactionData.ssn}/subtract_funds`, {
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
            setSuccessMessage(`Successfully withdrew $${transactionData.transaction_amount}!`);
            // call the callback to update the balance in the parent
			if (onTransactionSuccess) {
                onTransactionSuccess();
            }
            // reset the withdrawal form after 5 seconds
            setTimeout(() => {
                // clear the withdrawal amount input field
                setWithdrawalAmount('');
                // clear the success message
                setSuccessMessage('');
                // reset processing state
                setIsProcessing(false);
            }, 5000);
            
        } catch (error) {
            console.error('Error during withdrawal:', error);
            setErrorMessage('Withdrawal failed. Please try again.');
            withdrawalAmountInputRef.current.focus();
            setIsProcessing(false);
        }
    };

    return (
        <div>
			<h2 style={{ textAlign: 'center' }}>Withdraw Funds</h2>
			<transactionform onSubmit={handleWithdrawal}>
				<label htmlFor="withdrawalAmount" style={{ textAlign: 'center' }}>Amount to Withdraw:</label>
				<input
					type="number"
                    min='1.00'
                    max='500.00'
                    step='0.01'
					id="withdrawalAmount"
					value={withdrawalAmount}
					onChange={(e) => setWithdrawalAmount(e.target.value)}
					required
                    ref={withdrawalAmountInputRef}
                    disabled={isProcessing}
				/>
                {errorMessage && <p 
                    className="error-message" 
                >
                    {errorMessage}
                </p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
				<button type="submit" disabled={isProcessing}>Withdraw</button>
			</transactionform>
		</div>
    )
};

export default Withdrawal;