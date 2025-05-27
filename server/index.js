// requirements for backend service
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); // promise-based MySQL client
const app = express(); // express application
const cors = require('cors'); // frontend communication
const PORT = process.env.PORT || 5000; // in case env not setup

app.use(cors());
app.use(express.json());

// create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// function to connect to the database with retry logic
const connectWithRetry = () => {
  pool.getConnection()
    .then(connection => {
      console.log('Database connected successfully');
      connection.release(); // release the connection back to the pool
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Database connection failed, retrying in 5 seconds...', err.message);
      setTimeout(connectWithRetry, 5000); // retry after 5 seconds
    });
};

// initiate the connection attempt
connectWithRetry();

module.exports = pool; // export the pool for use in routes

// import and use routes
const userRoutes = require('./routes/user');
const bankAccountRoutes = require('./routes/bank_account');
const registrationRoutes = require('./routes/registration');
const transactionHistoryRoutes = require('./routes/transaction_history');
// use the routes
app.use('/api', userRoutes);
app.use('/api', bankAccountRoutes);
app.use('/api', registrationRoutes);
app.use('/api', transactionHistoryRoutes);

// handle the request at localhost port 5000
app.get('/', (req, res) => {
  res.send('WCU API is running!');
});