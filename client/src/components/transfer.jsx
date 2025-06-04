import React, { useState, useEffect, useRef } from 'react';

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

    // use state for the transfer and phone number success messages
    const [transferSuccessMessage, setTransferSuccessMessage] = useState('');
    const [phoneNumberSuccessMessage, setPhoneNumberSuccessMessage] = useState('');

    // use state to disable the transfer input/button during processing
    const [isProcessing, setIsProcessing] = useState(false);

    // reference to the phone number and transfer amount input fields
    const phoneNumberInputRef = useRef(null);
    const transferAmountInputRef = useRef(null);

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
            return;
        }

        // fetch the user by phone number
        const response = await fetch(`http://localhost:5000/api/users/phone_number/${rawPhoneNumber}`);
        console.log('searching for user by phone number:', rawPhoneNumber);

        if (!response.ok) {
            console.error('Failed to fetch user by phone number');
            setPhoneNumberError('User not found. Please check the phone number and try again.');
            // focus the phone number input field for user convenience
			phoneNumberInputRef.current.focus();
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
            alert('Failed to fetch bank account balance. Please try again later.');
            // focus the transfer amount input field for user convenience
			transferAmountInputRef.current.focus();
            setIsProcessing(false);
            return;
        }
        // parse the response to get the balance
        const balanceData = await balanceResponse.json();
        // check if the balance is sufficient for the transfer
        if (balanceData.balance < parseFloat(transferAmount)) {
            alert('Insufficient balance for this transfer.');
            // focus the transfer amount input field for user convenience
			transferAmountInputRef.current.focus();
            setIsProcessing(false);
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
            // focus the transfer amount input field for user convenience
			transferAmountInputRef.current.focus();
            setIsProcessing(false);
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
            alert('Failed to update bank account balance. Please try again later.');
            // focus the transfer amount input field for user convenience
			transferAmountInputRef.current.focus();
            setIsProcessing(false);
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
            alert('Failed to create transaction. Please try again later.');
            // focus the transfer amount input field for user convenience
			transferAmountInputRef.current.focus();
            setIsProcessing(false);
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
            alert('Failed to update recipient bank account balance. Please try again later.');
            // focus the transfer amount input field for user convenience
			transferAmountInputRef.current.focus();
            setIsProcessing(false);
            return;
        }

        //alert('Bank account balance updated successfully for the recipient!');
        // show success message
        setTransferSuccessMessage(`Successfully transferred $${transferAmount} to ${displayPhoneNumber}`);
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
            // reset processing state
            setIsProcessing(false);
        }, 5000);
    };

    return (
        <div>
            <h2>Transfer Funds</h2>
            <form onSubmit={handleSearch}>
                <label>
                    Recipient Phone Number:
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
                </label>
                <button type="submit" disabled={isRecipientFound}>Search</button>
                {isRecipientFound && !isProcessing && ( 
                    <button type="button" onClick={handleCancelSearch} className="cancel-button">
                        Cancel
                    </button>
                )}
            </form>

            {isRecipientFound && (
                <form onSubmit={handleTransfer}>
                    <label>
                        Transfer Amount:
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
                    </label>
                    {transferSuccessMessage && <p className="success-message">{transferSuccessMessage}</p>}
                    <button type="submit" disabled={isProcessing}>Transfer</button>
                </form>
            )}
        </div>   
    )
};

export default Transfer;