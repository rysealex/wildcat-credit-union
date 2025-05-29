import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from "./components/sign_up";
import DisplayAccountInfo from "./components/display_account_info";
import AtmLocator from "./components/atm_locator";
import Homepage from "./components/homepage";
import Deposit from "./components/deposit";

function App() {

  // use state for backend message
  const [message, setMessage] = useState('');

  // fetch message from backend service
  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => setMessage('Error: ' + err));
  }, []);

  return (
    <Router>
      <div>
        <h1>WCU Frontend</h1>
        <p>{message}</p>
      </div>
      <Routes>]

              <Route path="/" element={<SignUp />} />
        <Route path="/display_account_info" element={<DisplayAccountInfo />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/" element={<SignUp />} />
      

        <Route path="/atm_locator" element={<AtmLocator />} />
        <Route path="/deposit" element={<Deposit />} />
      </Routes>
    </Router>
  )
}

export default App;