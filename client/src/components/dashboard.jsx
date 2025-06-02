import React from 'react';
import '../index.css';
import { FaMapMarkerAlt, FaExchangeAlt, FaHistory, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
    // Hardcoded user info for UI purposes
    const accountNumber = '1234567890';
    const balance = '$4,500.25';

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <img src="/mount.png" alt="WCU Logo" className="dashboard-logo" />

                <h1 className="dashboard-heading">Welcome to Your Dashboard</h1>

                <div className="account-info">
                    <p><strong>Account Number:</strong> {accountNumber}</p>
                    <p><strong>Current Balance:</strong> {balance}</p>
                </div>
            </div>

            {/* Move tabs here */}
            <div className="dashboard-tabs">
                <button className="dashboard-tab">
                    <FaMapMarkerAlt className="tab-icon" /> ATM Locator
                </button>
                <button className="dashboard-tab">
                    <FaHistory className="tab-icon" /> Transaction History
                </button>
                <button className="dashboard-tab">
                    <FaExchangeAlt className="tab-icon" /> Transfer
                </button>
                <button className="dashboard-tab">
                    <FaMoneyBillWave className="tab-icon" /> Deposit/Withdrawal
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
