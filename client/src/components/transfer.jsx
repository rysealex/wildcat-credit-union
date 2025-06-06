import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
    // use state for the transfer amount and is found recipient
    const [transferAmount, setTransferAmount] = useState('');
    const [isRecipientFound, setIsRecipientFound] = useState(false);
    // display phone number in the desired format
    const [displayPhoneNumber, setDisplayPhoneNumber] = useState('');
    // raw phone number input for storage
    const [rawPhoneNumber, setRawPhoneNumber] = useState('');
    // use state to hold the input error messages
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [transferError, setTransferError] = useState('');

    // use state for the transfer and phone number success messages
    const [transferSuccessMessage, setTransferSuccessMessage] = useState('');
    const [phoneNumberSuccessMessage, setPhoneNumberSuccessMessage] = useState('');

    // use state to disable the transfer input/button during processing
    const [isProcessing, setIsProcessing] = useState(false);

    // use state for the current user's bank account balance
    const [balance, setBalance] = useState('');

    // function to fetch the current user's bank account balance
    const fetchUserBalance = useCallback(async () => {

    // get the current user's ssn from local storage
    const ssnFromStorage = localStorage.getItem('curr_user_ssn');
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

    // reference to the phone number and transfer amount input fields
    const phoneNumberInputRef = useRef(null);
    const transferAmountInputRef = useRef(null);

    //navigation function
	const navigate = useNavigate();
	const handleGoBack = () => { navigate('/dashboard');};

    // function to handle phone number formatting
	const handlePhoneNumberChange = (e) => {
		const input = e.target.value;
		// remove all non-digit characters
		let digits = input.replace(/\D/g, '');
		// limit to 10 digits
		digits = digits.substring(0, 10);
		// format the phone number as (XXX) XXX-XXXX
		if (digits.length === 10) {
			setDisplayPhoneNumber(`(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`);
		} else {
			setDisplayPhoneNumber(digits);
		}
		// update the raw phone number state
		setRawPhoneNumber(digits);
	};

    // perform phone number validation
	const validatePhoneNumber = () => {
		if (rawPhoneNumber.length !== 10) {
			setPhoneNumberError('Phone number must be exactly 10 digits');
			// focus the phone number input field for user convenience
			phoneNumberInputRef.current.focus();
			return;
		} else {
			setPhoneNumberError('');
		}
	};

    // handle the cancel search button click
    const handleCancelSearch = () => {
        // reset all states related to the recipient search and transfer
        setIsRecipientFound(false);
        setTransferAmount('');
        setDisplayPhoneNumber('');
        setRawPhoneNumber('');
        setPhoneNumberError('');
        setTransferError('');
        setPhoneNumberSuccessMessage('');
        setTransferSuccessMessage('');
        setIsProcessing(false);
    };
    
    // handle the search for recipient by phone number
    const handleSearch = async (e) => {
        e.preventDefault();

        // prevent search if recipient is already found
        if (isRecipientFound) {
            return;
        }

        // get the current user's phone number from local storage
        const currUserPhoneNumber = localStorage.getItem('curr_user_phone_number');

        // first check if the search phone number is the same as the current user's phone number
        if (rawPhoneNumber === currUserPhoneNumber) {
            setPhoneNumberError('You cannot transfer money to yourself. Please enter a different phone number.');
            // focus the phone number input field for user convenience
			phoneNumberInputRef.current.focus();
            // reset the display phone number input
            setDisplayPhoneNumber('');
            return;
        }

        // fetch the user by phone number
        const response = await fetch(`http://localhost:5000/api/users/phone_number/${rawPhoneNumber}`);

        if (!response.ok) {
            console.error('Failed to fetch user by phone number');
            setPhoneNumberError('User not found. Please check the phone number and try again.');
            // focus the phone number input field for user convenience
			phoneNumberInputRef.current.focus();
            // reset the display phone number input
            setDisplayPhoneNumber('');
            // set recipient found state to false
            setIsRecipientFound(false);
            // clear success message for phone number
            setPhoneNumberSuccessMessage('');
            return;
        }

        // show success message
        setPhoneNumberSuccessMessage(`User found: ${displayPhoneNumber}`);

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

        // prevent input/clicks while processing
        if (isProcessing) {
            return;
        }
        setIsProcessing(true);

        // get the user's SSN from local storage
        const currUserSsn = localStorage.getItem('curr_user_ssn');

        // first check if user has enough balance for the transfer
        const balanceResponse = await fetch(`http://localhost:5000/api/bank_accounts/${currUserSsn}`);
        if (!balanceResponse.ok) {
            console.error('Failed to fetch bank account balance');
            setTransferError('Failed to fetch bank account balance. Please try again later.');
            setTransferAmount('');
            setIsProcessing(false); // enable the input
            setTimeout(() => transferAmountInputRef.current?.focus(), 0);
            return;
        }
        // parse the response to get the balance
        const balanceData = await balanceResponse.json();
        // check if the balance is sufficient for the transfer
        if (balanceData.balance < parseFloat(transferAmount)) {
            setTransferError('Insufficient balance for this transfer.');
            setTransferAmount('');
            setIsProcessing(false); // enable the input
            setTimeout(() => transferAmountInputRef.current?.focus(), 0);
            return;
        }

        // after confirming that user has enough balance for transfer, create the transaction object for the sender
        const senderTransactionData = {
            ssn: currUserSsn, // use the actual user SSN from local storage
            date: new Date().toISOString().slice(0, 10), // current date in YYYY-MM-DD format
            transaction_type: 'Transfer',
            transaction_amount: parseFloat(transferAmount),
        };

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
            setTransferError('Failed to create transaction. Please try again later.');
            setTransferAmount('');
            setIsProcessing(false); // enable the input
            setTimeout(() => transferAmountInputRef.current?.focus(), 0);
            return;
        }

        //alert('Transaction history successful for the sender!');

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
            setTransferError('Failed to update bank account balance. Please try again later.');
            setTransferAmount('');
            setIsProcessing(false); // enable the input
            setTimeout(() => transferAmountInputRef.current?.focus(), 0);
            return;
        }

        //alert('Bank account balance updated successfully for the sender!');

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
            setTransferError('Failed to create transaction. Please try again later.');
            setTransferAmount('');
            setIsProcessing(false); // enable the input
            setTimeout(() => transferAmountInputRef.current?.focus(), 0);
            return;
        }

        //alert('Transaction history successful for the recipient!');

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
            setTransferError('Failed to update recipient bank account balance. Please try again later.');
            setTransferAmount('');
            setIsProcessing(false); // enable the input
            setTimeout(() => transferAmountInputRef.current?.focus(), 0);
            return;
        }

        //alert('Bank account balance updated successfully for the recipient!');
        // show success message
        setTransferSuccessMessage(`Successfully transferred $${transferAmount} to ${displayPhoneNumber}`);
        // call fetch user balance to dynamically update the user's current balance 
        fetchUserBalance();
        // reset the recipient found state after 5 seconds
        setTimeout(() => {
            setIsRecipientFound(false);
            // clear the transfer amount and recipient input field
            setTransferAmount('');
            setDisplayPhoneNumber('');
            setRawPhoneNumber('');
            // clear the success messages
            setPhoneNumberSuccessMessage('');
            setTransferSuccessMessage('');
            // clear the error messages
            setPhoneNumberError('');
            setTransferError('');
            // reset processing state
            setIsProcessing(false);
        }, 5000);
    };

    return (
        <div className="deposit-withdrawal-main-layout">
            <div className="header-row">
                <button onClick={handleGoBack} className="back-button">Back to Dashboard</button>
            </div>
            {/* Main Content Row */}
			<div className="content-row">
				<div className="form-box">
                    <div className='transfer-input-box'>
                        <h2 style={{ textAlign: 'center', marginBottom: 0 }}>Transfer Funds</h2>
                        <form onSubmit={handleSearch}>
                            <label style={{ textAlign: 'center' }}>
                                Recipient Phone Number:
                            </label>
                            <input 
                                type="text" 
                                value={displayPhoneNumber} 
                                onChange={handlePhoneNumberChange} 
                                onBlur={validatePhoneNumber} 
                                required 
                                ref={phoneNumberInputRef}
                                disabled={isRecipientFound}
                            />
                            {phoneNumberError && <p className="input-error-message">{phoneNumberError}</p>}
                            {phoneNumberSuccessMessage && <p className="success-message">{phoneNumberSuccessMessage}</p>}

                            <div className="recipient-search-buttons">
                                <button type="submit" disabled={isRecipientFound}>Search</button>
                                {isRecipientFound && !isProcessing && ( 
                                    <button type="button" onClick={handleCancelSearch} className="cancel-button">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                        {isRecipientFound && (
                            <form onSubmit={handleTransfer}>
                                <label style={{ textAlign: 'center' }}>
                                    Amount to Transfer:
                                </label>
                                <input 
                                    type="number" 
                                    min='1.00'
                                    max='500.00'
                                    step='0.01'
                                    value={transferAmount} 
                                    onChange={(e) => setTransferAmount(e.target.value)} 
                                    required 
                                    ref={transferAmountInputRef}
                                    disabled={isProcessing}
                                />
                                {transferError && <p className="input-error-message">{transferError}</p>}
                                {transferSuccessMessage && <p className="success-message">{transferSuccessMessage}</p>}
                                <button type="submit" disabled={isProcessing}>Transfer</button>
                            </form>
                        )}
                    </div>
				</div>
				<div className="balance-box">
					<h2>Current Balance</h2>
					<p>${balance}</p>
				</div>
			</div>
        </div>   
    )
};

export default Transfer;