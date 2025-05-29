import React, { useState } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import '../styles/homepage.css';

const Homepage = () => {

	// use navigate hook to programmatically navigate to other routes
	const navigate = useNavigate();

	// function to handle navigation to different routes
	const handleNavigation = (url) => {
		navigate(url);
	};

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        
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
                console.error('Login API error:', response.statusText);
                return;
            }

            // 3. parse the JSON response
            const data = await response.json();

            // 4. check if the user exists
            if (data.exists) {
                console.log('User exists, navigating to account info page.');
                // store the user's ssn in local storage for later use
                localStorage.setItem('curr_user_ssn', data.ssn);
                // 5. navigate to the display account info page
                handleNavigation('/display_account_info');
            } else {
                alert('User does not exist. Please check your credentials or sign up.');
            }

        } catch (error) {
            console.error('Error checking user existence:', error);
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
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Enter</button>
          <p className="join-wcu">Join WCU</p>
        </form>
      </div>
    </div>
  </div>
);
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
                        required
                    />
                    <button type="submit">Enter</button>
                    <a className="join-wcu" onClick={() => handleNavigation('/user_authentication')}>Join WCU</a>
                </form>

            </div>
        </div >
    );
};

export default Homepage;