import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from "./components/sign_up";
import Dashboard from "./components/dashboard";
import AtmLocator from "./components/atm_locator";
import Homepage from "./components/homepage";
import Deposit from "./components/deposit";
import TransactionHistory from "./components/transaction_history";

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <div>
        <h1>WCU Frontend</h1>
        <p>{message}</p>
      </div>
      <Routes>]
        <Route path="/" element={<Homepage />} />

              <Route path="/" element={<SignUp />} />
        <Route path="/display_account_info" element={<DisplayAccountInfo />} />
        <Route path="/" element={<SignUp />} />
      

=======
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction_history" element={<TransactionHistory />} />
>>>>>>> ea1d919c0b87942bef8dd13b4dc40ed2194cc125
        <Route path="/atm_locator" element={<AtmLocator />} />
        <Route path="/deposit" element={<Deposit />} />
      </Routes>
    </Router>
  );
}

export default App;