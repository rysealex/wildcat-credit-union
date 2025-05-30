import React, { useState, useEffect } from 'react';

const Withdrawal = () => {
    // use state to manage withdrawal amount and success message
    const [withdrawalAmount, setWithdrawalAmount] = useState('');

    // handle the withdrawal form submission
    const handleWithdrawal = async (e) => {
        e.preventDefault();

        // get the user's SSN from local storage
        const currUserSsn = localStorage.getItem('curr_user_ssn');

        // first check if user has enough balance for the withdrawal
        const balanceResponse = await fetch(`http://localhost:5000/api/bank_accounts/${currUserSsn}`);

        if (!balanceResponse.ok) {
            console.error('Failed to fetch bank account balance');
            alert('Failed to fetch bank account balance. Please try again later.');
            return;
        }

        // parse the response to get the balance
        const balanceData = await balanceResponse.json();

        // check if the balance is sufficient for the withdrawal
        if (balanceData.balance < parseFloat(withdrawalAmount)) {
            alert('Insufficient balance for this withdrawal.');
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
            // step 1: add transaction to transaction history
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

            // step 2: update bank account balance
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
            // clear the withdrawal amount input field
            setWithdrawalAmount('');
        } catch (error) {
            console.error('Error during withdrawal:', error);
            alert('Withdrawal failed. Please try again.');
        }
    };

    return (
        <div>
			<h2>Withdraw Money</h2>
			<form onSubmit={handleWithdrawal}>
				<label htmlFor="withdrawalAmount">Amount to Withdraw:</label>
				<input
					type="number"
					id="withdrawalAmount"
					value={withdrawalAmount}
					onChange={(e) => setWithdrawalAmount(e.target.value)}
					required
				/>
				<button type="submit">Withdraw</button>
			</form>
		</div>
    )
};

export default Withdrawal;