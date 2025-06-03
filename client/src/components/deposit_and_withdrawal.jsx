import React, { useEffect, useState } from 'react';
import Deposit from './deposit';
import Withdrawal from './withdrawal';
import '../index.css';

const Deposit_and_withdrawal = () => {
    return (
        <div>
            <Deposit />
            <Withdrawal />
        </div>
    );
};

export default Deposit_and_withdrawal;