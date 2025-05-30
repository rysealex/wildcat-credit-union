import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from "./components/sign_up";
import Dashboard from "./components/dashboard";
import AtmLocator from "./components/atm_locator";
import Homepage from "./components/homepage";
import Deposit from "./components/deposit";
import Withdrawal from "./components/withdrawal";
import TransactionHistory from "./components/transaction_history";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction_history" element={<TransactionHistory />} />
        <Route path="/atm_locator" element={<AtmLocator />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
      </Routes>
    </Router>
  );
}

export default App;