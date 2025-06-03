import React, { useEffect, useState } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import TransactionHistory from './transaction_history';
import { FaMapMarkerAlt, FaExchangeAlt, FaHistory, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {

    // use navigate hook to programmatically navigate to other routes
    const navigate = useNavigate();

    // function to handle navigation to different routes
    const handleNavigation = (url) => {
        navigate(url);
    };

    // use states for the current user's account number and balance
    const [accountNumber, setAccountNumber] = useState('');
    const [balance, setBalance] = useState('');

    // use effect to fetch the current user's information
    useEffect(() => {
        const fetchUserInformation = async () => {

            // get the current user's ssn from local storage
			const ssnFromStorage = localStorage.getItem('curr_user_ssn');
			if (!ssnFromStorage) {
				console.error('No user SSN found in local storage');
				return;
			}

            try {
                // step 1. fetch user information from users route for the account number
                const userInfoResponse = await fetch(`http://localhost:5000/api/users/${ssnFromStorage}`);
                if (!userInfoResponse.ok) {
					throw new Error('Failed to fetch user information');
				}
				const userData = await userInfoResponse.json();
				// extract the user account number from the user data
                setAccountNumber(userData.account_number);

                // step 2. fetch user bank account from bank_account route for the balance
                const bankAccountResponse = await fetch(`http://localhost:5000/api/bank_accounts/${ssnFromStorage}`);
                if (!bankAccountResponse.ok) {
					throw new Error('Failed to fetch bank account information');
				}
				const bankAccountData = await bankAccountResponse.json();
				// extract the user balance from the bank account data
                setBalance(bankAccountData.balance);
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        };
        // call the function to fetch user information
        fetchUserInformation();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <img src="/mount.png" alt="WCU Logo" className="dashboard-logo" />

                <h1 className="dashboard-heading">Welcome to Your Dashboard</h1>

                <div className="account-info">
                    <p><strong>Account Number:</strong> {accountNumber}</p>
                    <p><strong>Current Balance:</strong> ${balance}</p>
                </div>
            </div>

            {/* Move tabs here */}
            <div className="dashboard-tabs">
                <button className="dashboard-tab" onClick={() => handleNavigation('/atm_locator')}>
                    <FaMapMarkerAlt className="tab-icon" /> ATM Locator
                </button>
                {/*<button className="dashboard-tab">
                    <FaHistory className="tab-icon" /> Transaction History
                </button>*/}
                <button className="dashboard-tab" onClick={() => handleNavigation('/transfer')}>
                    <FaExchangeAlt className="tab-icon" /> Transfer
                </button>
                <button className="dashboard-tab" onClick={() => handleNavigation('/deposit_and_withdrawal')}>
                    <FaMoneyBillWave className="tab-icon" /> Deposit/Withdrawal
                </button>
            </div>
            <div>
                <TransactionHistory />
            </div>
        </div>
    );
};

export default Dashboard;
