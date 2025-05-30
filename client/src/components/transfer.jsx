import React, { useState, useEffect } from 'react';

const Transfer = () => {
    // use state for the transfer amount and is found recipient
    const [transferAmount, setTransferAmount] = useState('');
    const [isRecipientFound, setIsRecipientFound] = useState(false);
    // use state for the search user by phone number
    const [searchPhoneNumber, setSearchPhoneNumber] = useState('');

    // handle the search for recipient by phone number
    const handleSearch = async (e) => {
        e.preventDefault();

        // get the current user's phone number from local storage
        const currUserPhoneNumber = localStorage.getItem('curr_user_phone_number');

        // first check if the search phone number is the same as the current user's phone number
        if (searchPhoneNumber === currUserPhoneNumber) {
            alert('You cannot transfer money to yourself. Please enter a different phone number.');
            return;
        }

        // fetch the user by phone number
        const response = await fetch(`http://localhost:5000/api/users/${searchPhoneNumber}`);
        
        if (!response.ok) {
            console.error('Failed to fetch user by phone number');
            alert('User not found. Please check the phone number and try again.');
            return;
        }

        alert('User found! You can now proceed with the transfer.');

        // set the recipient found state to true
        setIsRecipientFound(true);

        // parse the response to get the user data
        const userData = await response.json();
        
        // store the recipient's SSN in local storage for later use
        localStorage.setItem('recipient_ssn', userData.ssn);
    };

    // handle the transfer form submission
    const handleTransfer = async (e) => {
        e.preventDefault();
        
        // get the user's SSN from local storage
        const currUserSsn = localStorage.getItem('curr_user_ssn');

        // first check if user has enough balance for the transfer
        const balanceResponse = await fetch(`http://localhost:5000/api/bank_accounts/${currUserSsn}`);
        if (!balanceResponse.ok) {
            console.error('Failed to fetch bank account balance');
            alert('Failed to fetch bank account balance. Please try again later.');
            return;
        }
        // parse the response to get the balance
        const balanceData = await balanceResponse.json();
        // check if the balance is sufficient for the transfer
        if (balanceData.balance < parseFloat(transferAmount)) {
            alert('Insufficient balance for this transfer.');
            return;
        }

        console.log(transferAmount);

        // after confirming that user has enough balance for transfer, create the transaction object for the sender
        const senderTransactionData = {
            ssn: currUserSsn, // use the actual user SSN from local storage
            date: new Date().toISOString().slice(0, 10), // current date in YYYY-MM-DD format
            transaction_type: 'Transfer',
            transaction_amount: parseFloat(transferAmount),
        };

        console.log(senderTransactionData);

        // step 1: send the transaction data to the server for the sender
        const transactionResponse = await fetch('http://localhost:5000/api/transaction_history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(senderTransactionData),
        });

        if (!transactionResponse.ok) {
            console.error('Failed to create transaction');
            alert('Failed to create transaction. Please try again later.');
            return;
        }

        alert('Transaction history successful for the sender!');

        // step 2: update the sender's bank account balance
        const bankAccountResponse = await fetch(`http://localhost:5000/api/bank_accounts/${senderTransactionData.ssn}/subtract_funds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                ssn: senderTransactionData.ssn, 
                amount: senderTransactionData.transaction_amount 
            }),
        });

        if (!bankAccountResponse.ok) {
            console.error('Failed to update bank account balance');
            alert('Failed to update bank account balance. Please try again later.');
            return;
        }

        alert('Bank account balance updated successfully for the sender!');

        // step 3: send the transaction data to the server for the recipient
        const recipientTransactionData = {
            ssn: localStorage.getItem('recipient_ssn'), // use the recipient SSN from local storage
            date: new Date().toISOString().slice(0, 10), // current date in YYYY-MM-DD format
            transaction_type: 'Receive',
            transaction_amount: parseFloat(transferAmount),
        };

        const recipientTransactionResponse = await fetch('http://localhost:5000/api/transaction_history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipientTransactionData),
        });

        if (!recipientTransactionResponse.ok) {
            console.error('Failed to create transaction');
            alert('Failed to create transaction. Please try again later.');
            return;
        }

        alert('Transaction history successful for the recipient!');

        // step 4: update the recipient's bank account balance
        const recipientBankAccountResponse = await fetch(`http://localhost:5000/api/bank_accounts/${recipientTransactionData.ssn}/funds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                ssn: recipientTransactionData.ssn, 
                amount: recipientTransactionData.transaction_amount 
            }),
        });

        if (!recipientBankAccountResponse.ok) {
            console.error('Failed to update recipient bank account balance');
            alert('Failed to update recipient bank account balance. Please try again later.');
            return;
        }

        alert('Bank account balance updated successfully for the recipient!');
        // clear the transfer amount and recipient input field
        setTransferAmount('');
        setSearchPhoneNumber('');
        // reset the recipient found state
        setIsRecipientFound(false);
    };

    return (
        <div>
            <h2>Transfer Funds</h2>
            <form onSubmit={handleSearch}>
                <label>
                    Recipient Phone Number:
                    <input 
                        type="text" 
                        value={searchPhoneNumber} 
                        onChange={(e) => setSearchPhoneNumber(e.target.value)} 
                        required 
                    />
                </label>
                <button type="submit">Search</button>
            </form>

            {isRecipientFound && (
                <form onSubmit={handleTransfer}>
                    <label>
                        Transfer Amount:
                        <input 
                            type="number" 
                            value={transferAmount} 
                            onChange={(e) => setTransferAmount(e.target.value)} 
                            required 
                        />
                    </label>
                    <button type="submit">Transfer</button>
                </form>
            )}
        </div>   
    )
};

export default Transfer;