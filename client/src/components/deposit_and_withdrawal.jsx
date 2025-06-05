import React, { useEffect, useState } from 'react';
import Deposit from './deposit';
import Withdrawal from './withdrawal';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Deposit_and_withdrawal = () => {
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
		
        <div >
			{/* Header */}
			<h1 className='header3'>Make a Deposit or Withdraw</h1>
			<div >
				<button onClick={handleGoBack} className="nav-button">Back to Dashboard</button>
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
				<div className="formbox-dep-with">
                    <div className='deposit-withdrawal-input'>
                        {activeForm === 'deposit' && <Deposit />}
					    {activeForm === 'withdrawal' && <Withdrawal />} 
                    </div>
				</div>

				<div className="dep-with-balance">
					<h2>Current Balance</h2>
					<p>$3,200.00</p> {/* Replace with real data later */}
				</div>
			</div>
		</div>
    );
};

export default Deposit_and_withdrawal;