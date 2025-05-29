import React, { useState, useEffect } from 'react';

const Dashboard = () => {

    return (
        <div className="dashboard">
            <h1>Welcome to Your Dashboard</h1>
            <p>This is where you can manage your account, view transaction history, and more.</p>
            <ul>
                <li><a href="/transaction_history">View Transaction History</a></li>
                <li><a href="/atm_locator">Find ATMs</a></li>
                <li><a href="/deposit">Make a Deposit</a></li>
            </ul>
        </div>
    );
};

export default Dashboard;