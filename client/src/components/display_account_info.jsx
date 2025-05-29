import React, { useState, useEffect } from 'react';

const DisplayAccountInfo = () => {

	// use state to manage transaction history
  const [transactionHistory, setTransactionHistory] = useState([]);

	// use effect to fetch transaction history when the component mounts
	useEffect(() => {
		const fetchTransactionHistory = async () => {

			// get the user's ssn from local storage
			const currUserSsn = localStorage.getItem('curr_user_ssn');

			try {
				// fetch transaction history from the backend API
				const response = await fetch(`http://localhost:5000/api/transaction_history/${currUserSsn}`);
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

	return (
		<div>
			<h2>Transaction History</h2>
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
							<td>{transaction.date}</td>
							<td>{transaction.transaction_type}</td>
							<td>{transaction.transaction_amount}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DisplayAccountInfo;