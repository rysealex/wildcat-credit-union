import React, { useEffect, useState } from "react";

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
    <div>
      <h1>WCU Frontend</h1>
      <p>{message}</p>
    </div>
  )
}

export default App;