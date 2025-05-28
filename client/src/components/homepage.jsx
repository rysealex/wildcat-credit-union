import React, { useState } from 'react';
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

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login attempted with:', email, password);
        // Handle authentication logic or navigation here
    };

    return (
        <div className="homepage">
            <div className="logo-section">
                {/* Replace with your actual logo image */}
                <img src="/wcu.png" alt="WCU Logo" className="logo" />
                <p className="tagline">Wildcat Credit Union</p>
            </div>
            <div className="divider" />

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
                    <button type="submit" onClick={() => handleNavigation('/display_account_info')}>Enter</button>
                    <a className="join-wcu" onClick={() => handleNavigation('/user_authentication')}>Join WCU</a>
                </form>

            </div>
        </div >
    );
};

export default Homepage;