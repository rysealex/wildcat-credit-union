import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserAuthentication from "./components/user_authentication";
import DisplayAccountInfo from "./components/display_account_info";
import AtmLocator from "./components/atm_locator";
import Homepage from "./components/homepage";
import Deposit from "./components/deposit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/user_authentication" element={<UserAuthentication />} />
        <Route path="/display_account_info" element={<DisplayAccountInfo />} />
        <Route path="/atm_locator" element={<AtmLocator />} />
        <Route path="/deposit" element={<Deposit />} />
      </Routes>
    </Router>
  )
}

export default App;