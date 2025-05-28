import React, { useState } from 'react';
import '../styles/homepage.css';

const Homepage = () => {
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
                    <button type="submit">Enter</button>
                    <p className="join-wcu">Join WCU</p>
                </form>

            </div>
        </div >
    );
};

export default Homepage;