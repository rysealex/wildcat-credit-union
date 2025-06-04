import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

// this component handles user authentication
const SignUp = () => {

	// use navigate hook to programmatically navigate to other routes
	const navigate = useNavigate();

	// function to handle navigation to different routes
	const handleNavigation = (url) => {
		navigate(url);
	};

	// state variables for user authentication
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// display SSN in the desired format
	const [displaySSN, setDisplaySSN] = useState('');
	// raw SSN input for storage
	const [rawSSN, setRawSSN] = useState('');

	// display phone number in the desired format
	const [displayPhoneNumber, setDisplayPhoneNumber] = useState('');
	// raw phone number input for storage
	const [rawPhoneNumber, setRawPhoneNumber] = useState('');

	// use state to hold the input error messages
	const [phoneNumberError, setPhoneNumberError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [ssnError, setSSNError] = useState('');
	// use state to hold the backend error message
	const [backendError, setBackendError] = useState('');

	// reference to the input fields
	const passwordInputRef = useRef(null);
	const phoneNumberInputRef = useRef(null);
	const ssnInputRef = useRef(null);

	// function to validate the password
    const validatePassword = (password) => {
        // requirements for password
        const minLen = 5;
		const maxLen = 25;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-={};':"|,.<>?]/.test(password);

        // check if password meets the requirements
        if (password.length < minLen) {
            return `Password must be at least ${minLen} characters long`;
        }
		if (password.length > maxLen) {
			return `Password must be less than ${maxLen} characters long`;
		}
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasNumber) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        // If all checks pass, clear the error message and return no error message
        setPasswordError('');
        return '';
    };

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

	// function to handle SSN formatting
	const handleSSNChange = (e) => {
		const input = e.target.value;
		// remove all non-digit characters
		let digits = input.replace(/\D/g, '');
		// limit to 9 digits
		digits = digits.substring(0, 9);
		// format the SSN as XXX-XX-XXXX
		if (digits.length === 9) {
			setDisplaySSN(`${digits.substring(0, 3)}-${digits.substring(3, 5)}-${digits.substring(5)}`);
		} else {
			setDisplaySSN(digits);
		}
		// update the raw SSN state
		setRawSSN(digits);
	};

	// perform SSN validation
	const validateSSN = () => {
		if (rawSSN.length !== 9) {
			setSSNError('SSN must be exactly 9 digits');
			// focus the SSN input field for user convenience
			ssnInputRef.current.focus();
			return;
		} else {
			setSSNError('');
		}
	};

	// function to generate a cryptographically secure random alphanumeric string
	const genRandomAlphanumeric = (len) => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		const randomBytes = new Uint8Array(len);
		window.crypto.getRandomValues(randomBytes); // fill array with random values
		// map random byte to a character in chars
		for (let i = 0; i < len; i++) {
			result += chars.charAt(randomBytes[i] % chars.length);
		}
		return result;
	}

	// function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// perform password validation
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            // if validation fails, set the error message and stop further execution
            setPasswordError(passwordValidationError);
            // focus the password input field for user convenience
            passwordInputRef.current.focus();
            return;
        } else {
            setPasswordError(''); // clear the error if validation passes
        }

		// generate the current user's account number
		const randomSuffix = genRandomAlphanumeric(9);
		const generatedAccountNumber = `WCU${randomSuffix}`;

		// create user data object
		const userData = {
			fname: fname,
			lname: lname,
			email: email,
			ssn: rawSSN,
			password: password,
			phone_number: rawPhoneNumber,
			account_number: generatedAccountNumber
		};

		try {
			// send a POST request to the backend API to add a new user
			const response = await fetch('http://localhost:5000/api/registration', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				// check what type of error occurred
                if (response.status === 400) {
                    // bad request, likely due to validation errors
                    setBackendError('Invalid input. Please check all fields.');
                } else if (response.status === 409 || response.status === 500) {
                    // conflicts with existing users
                    setBackendError('An account with this email, phone number or SSN already exists.');
                } else {
                    // generic server error
                    setBackendError('An error unexpected occurred. Please try again later.');
                }
                console.error('Login API error:', errorData.message || response.statusText);
                return;
			}

			const data = await response.json();
			console.log('User added successfully:', data);
			// navigate to the home page (log back into account) after successful registration
			handleNavigation('/');
		} catch (error) {
			console.error('Error:', error);
			setBackendError('An unexpected error occurred. Please try again later.');
		}
	};

	return (
		<div className="form-wrapper">
			<form className="signup-form" onSubmit={handleSubmit}>
				<img src="/mount.png" alt="Join Wildcat Credit Union" className="signup-header-logo" />
				<div className="form-group">
					<label>First Name:</label>
					<input type="text" value={fname} onChange={(e) => setFname(e.target.value)} required />
				</div>

				<div className="form-group">
					<label>Last Name:</label>
					<input type="text" value={lname} onChange={(e) => setLname(e.target.value)} required />
				</div>

				<div className="form-group">
					<label>Email:</label>
					<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>

				<div className="form-group">
					<label>Phone Number:</label>
					<input 
						type="tel" 
						value={displayPhoneNumber} 
						onChange={handlePhoneNumberChange} 
						onBlur={validatePhoneNumber} 
						required 
						ref={phoneNumberInputRef}
					/>
					{phoneNumberError && <p className="input-error-message">{phoneNumberError}</p>}
				</div>

				<div className="form-group">
					<label>SSN:</label>
					<input 
						type="text" 
						value={displaySSN} 
						onChange={handleSSNChange} 
						onBlur={validateSSN}
						required 
						ref={ssnInputRef}
					/>
					{ssnError && <p className="input-error-message">{ssnError}</p>}
				</div>

				<div className="form-group">
					<label>Password:</label>
					<input 
						type="password" 
						value={password} onChange={(e) => setPassword(e.target.value)} 
						required 
						ref={passwordInputRef}
					/>
					{passwordError && <p className="input-error-message">{passwordError}</p>}
				</div>
				{backendError && <p className="input-error-message">{backendError}</p>}
				<button type="submit">Join</button>
				<div style={{ textAlign: 'center' }}>
					<p>
						Already have an account?{' '}
						<span onClick={() => handleNavigation('/')} className="join-wcu" >
							Click here to login!
						</span>
					</p>
				</div>
			</form>
			
		</div>
	);
};

export default SignUp;