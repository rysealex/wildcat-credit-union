import React, { useEffect, useState } from 'react';
import Deposit from './deposit';
import Withdrawal from './withdrawal';
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

    return (
        <div className = 'deposit-withdrawal-main-layout'>
            <div className=' content-wrapper-with-buttons'>

            
                <div className = 'form-toggle-buttons-stacked'>
                    <button onClick={handleViewDep} className={activeForm === 'deposit' ? 'active-button' : ' '}>
                        Deposit
                    </button>
                    <button onClick={handleViewWith} className={activeForm === 'withdrawal' ? 'active-button' : ' '}>
                    Withdraw
                    </button>
                </div>
                <div className='form-content-area-centered'>
                    {activeForm === 'deposit' && (
                    <div className='form-container'>
                    
                        <Deposit />
                    </div>
                
                )}
                {activeForm === 'withdrawal' && (
                    <div className='form-container'>
                    
                        <Withdrawal />
                    </div> 
                )}
                </div>
                
                
            </div>
        </div>
    );
};

export default Deposit_and_withdrawal;