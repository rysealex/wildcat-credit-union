import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from "./components/sign_up";
import Dashboard from "./components/dashboard";
import AtmLocator from "./components/atm_locator";
import Homepage from "./components/homepage";
import Deposit_and_withdrawal from "./components/deposit_and_withdrawal";
import Transfer from "./components/transfer";
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
        <Route path="/deposit_and_withdrawal" element={<Deposit_and_withdrawal />} />
        <Route path="/transfer" element={<Transfer />} />
      </Routes>
    </Router>
  );
}

export default App;