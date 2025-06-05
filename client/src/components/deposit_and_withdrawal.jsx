import React, { useCallback, useEffect, useState } from 'react';
import Deposit from './deposit';
import Withdrawal from './withdrawal';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Deposit_and_withdrawal = () => {
	// use state for the current user's bank account balance
	const [balance, setBalance] = useState('');

	// function to fetch the current user's bank account balance
	const fetchUserBalance = useCallback(async () => {

		// get the current user's ssn from local storage
		const ssnFromStorage = localStorage.getItem('curr_user_ssn');
		console.log(ssnFromStorage);
		if (!ssnFromStorage) {
			console.error('No user SSN found in local storage');
			return;
		}

		try {
			// step 1. fetch user bank account from bank_account route for the balance
			const bankAccountResponse = await fetch(`http://localhost:5000/api/bank_accounts/${ssnFromStorage}`);
			if (!bankAccountResponse.ok) {
				throw new Error('Failed to fetch bank account information');
			}
			const bankAccountData = await bankAccountResponse.json();
			// extract the user balance from the bank account data
			setBalance(bankAccountData.balance);
		} catch (error) {
			console.error('Error fetching user bank account balance:', error);
		}
	}, []);

	// useEffect to fetch the initial balance when the component mounts
    useEffect(() => {
        fetchUserBalance();
    }, [fetchUserBalance]);

    //Conditionally rendering the pages dependint on the button toggled
    //default is deposit
    const [activeForm, setActiveForm] = useState('deposit')
    const handleViewDep = () => {
        setActiveForm('deposit');
    };
    const handleViewWith = () => {
        setActiveForm('withdrawal')
    };

    //navigation function
	const navigate = useNavigate();
	const handleGoBack = () => { navigate('/dashboard');};

    return (
        <div className="deposit-withdrawal-main-layout">
			{/* Header */}
			<div className="header-row">
				<button onClick={handleGoBack} className="back-button">Back to Dashboard</button>
				<div className="toggle-buttons">
					<button
						onClick={handleViewDep}
						className={activeForm === 'deposit' ? 'toggle-btn active' : 'toggle-btn'}
					>
						Deposit
					</button>
					<button
						onClick={handleViewWith}
						className={activeForm === 'withdrawal' ? 'toggle-btn active' : 'toggle-btn'}
					>
						Withdraw
					</button>
				</div>
			</div>

			{/* Main Content Row */}
			<div className="content-row">
				<div className="form-box">
                    <div className='deposit-withdrawal-input'>
                        {activeForm === 'deposit' && <Deposit onTransactionSuccess={fetchUserBalance} />}
					    {activeForm === 'withdrawal' && <Withdrawal onTransactionSuccess={fetchUserBalance} />} 
                    </div>
				</div>

				<div className="balance-box">
					<h2>Current Balance</h2>
					<p>${balance}</p>
				</div>
			</div>
		</div>
    );
};

export default Deposit_and_withdrawal;