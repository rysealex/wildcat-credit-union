	import React, { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';

	const TransactionHistory = () => {

		// use state to manage transaction history
		const [transactionHistory, setTransactionHistory] = useState([]);

		// second use effect to fetch transaction history when the component mounts after ssn is set
		useEffect(() => {
			const fetchTransactionHistory = async () => {

				// get the current user's ssn from local storage
				const ssnFromStorage = localStorage.getItem('curr_user_ssn');
				if (!ssnFromStorage) {
					console.error('No user SSN found in local storage');
					return;
				}

				try {
					// fetch transaction history from the backend API
					const response = await fetch(`http://localhost:5000/api/transaction_history/${ssnFromStorage}`);
					if (!response.ok) {
						throw new Error('Failed to fetch transaction history');
					}
					const data = await response.json();
					setTransactionHistory(data);
				} catch (error) {
					console.error('Error fetching transaction history:', error);
				}
			};
			// call the function to fetch transaction history
			fetchTransactionHistory();
		}, []);

		// function to format the transaction date (MM/DD/YYYY)
		const formatDate = (dateString) => {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US');
		};

		// function to determine the sign and color based on the transaction type
		const getAmountDisplay= (type, amount) => {
			let sign = '';
			let className = '';
			// format the amount to two decimal places
			const numericAmount = parseFloat(amount);
			const formattedAmount = numericAmount.toFixed(2); // two decimal places
			if (type === 'Welcome' || type === 'Deposit' || type === 'Receive') {
				sign = '+';
				className = 'amount-positive';
			} else {
				sign = '-';
				className = 'amount-negative';
			}
			// return the correct amount display
			return (
				<span className={className}>
					{sign} ${formattedAmount}
				</span>
			);
		};

		return (
			<div>
				<h2 style={{ textAlign: 'center' }}>Transaction History</h2>
				<div className='transaction-history-scroll-box'>
					<table>
						<thead>
							<tr>
								<th>Date</th>
								<th>Type</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{transactionHistory.map((transaction, index) => (
								<tr key={index}>
									<td>
										{formatDate(transaction.date)}
									</td>
									<td>
										{transaction.transaction_type}
									</td>
									<td>
										{getAmountDisplay(
											transaction.transaction_type, transaction.transaction_amount
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	export default TransactionHistory;