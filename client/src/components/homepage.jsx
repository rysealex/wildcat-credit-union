import React, { useState, useRef } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {

	// use navigate hook to programmatically navigate to other routes
	const navigate = useNavigate();

	// function to handle navigation to different routes
	const handleNavigation = (url) => {
		navigate(url);
	};

    // use state to manage email and password inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // use state to hold the password error message
    const [passwordError, setPasswordError] = useState('');
    // use state to hold the backend error message
    const [backendError, setBackendError] = useState('');
    // use state to manage the number of login attempts left before account lockdown
    const [attemptsLeft, setAttemptsLeft] = useState(null);

    // reference to the password input field
    const passwordInputRef = useRef(null);

    // function to validate the password
    const validatePassword = (password) => {
        // requirements for password
        const minLen = 5;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-={};':"|,.<>?]/.test(password);

        // check if password meets the requirements
        if (password.length < minLen) {
            return `Password must be at least ${minLen} characters long`;
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

    const handleLogin = async (e) => {
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
        
        try {
            // 1. call the backend API to check if the user exists
            const response = await fetch('http://localhost:5000/api/users/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            // 2. check if the response is ok
            if (!response.ok) {
                const errorData = await response.json();
                // check what type of error occurred
                if (response.status === 423) {
                    // account is locked
                    setBackendError(errorData.message || 'Account is temporarily locked due to too many failed attempts.');
                    setAttemptsLeft(null);
                } else if (response.status === 401 || response.status === 400) {
                    // bad request, likely due to validation errors
                    setBackendError('Invalid input. Please check your email and password.');
                    setPassword(''); // reset password field
                    
                    // calculate the number of login attempts left for current user
                    const maxAttempts = 5;
                    const remainingAttempts = maxAttempts - errorData.login_attempts;
                    // make sure remaining attempts is not negative
                    if (errorData.login_attempts !== undefined) {
                        setAttemptsLeft(remainingAttempts > 0 ? remainingAttempts : 0); 
                    } else {
                        setAttemptsLeft(null);
                    }
                } else {
                    setBackendError(errorData.message || 'An unexpected error occurred. Please try again later.');
                    console.error('Login API error:', errorData);
                }
                passwordInputRef.current.focus(); // focus password field for convenience on error
                return;
            }

            // 3. parse the JSON response
            const data = await response.json();

            // 4. check if the user exists
            if (data.exists) {
                // store the user's ssn in local storage for later use
                localStorage.setItem('curr_user_ssn', data.ssn);
                
                // clean the phone number by removing non-digit characters
                const cleanedPhoneNumber = data.phone_number ? String(data.phone_number).replace(/\D/g, '') : '';
                // store the user's phone number in local storage for later use
                localStorage.setItem('curr_user_phone_number', cleanedPhoneNumber);
                // 5. navigate to the dashboard page
                handleNavigation('/dashboard');
            } else {
                setBackendError('User does not exist. Please check your credentials or sign up');
                // focus the password input field for user convenience
                passwordInputRef.current.focus();
            }

        } catch (error) {
            console.error('Error checking user existence:', error);
            setBackendError('An unexpected error occurred. Please try again later.');
        }
    };
    return (
    <div className="outer-wrapper">
        <div className="main-container">
        <div className="logo-section">
            <div className="logo-wrapper">
            <img src="wcu.png" alt="WCU Logo" className="logo" />
            <p className="tagline">Wildcat Credit Union</p>
            </div>
        </div>

        <div className="divider"></div>

        <div className="form-section">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                ref={passwordInputRef} 
                required 
            />
            {passwordError && <p className="input-error-message">{passwordError}</p>}
            {backendError && <p className="input-error-message">{backendError}</p>}
            {attemptsLeft !== null && attemptsLeft > 0 && (
                <p className="input-error-message">
                    You have {attemptsLeft} login attempt(s) remaining before your account will be temporarily locked.
                </p>
            )}
            <button type="submit">Enter</button>
            <p className="join-wcu" onClick={() => handleNavigation('/sign_up')}>Join WCU</p>
            </form>
        </div>
        </div>
    </div>
    );
};

export default Homepage;