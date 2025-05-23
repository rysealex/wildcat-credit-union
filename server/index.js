// requirements for backend service
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express(); // express application
const cors = require('cors'); // frontend communication
const PORT = process.env.PORT || 5000; // in case env not setup

app.use(cors());
app.use(express.json());

// connection to MySQL database
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: 3306
});

db.connect(err => {
	if (err) {
		console.log('Database connection failed', err);
	} else {
		console.log('Connected to MySQL Database');
	}
});

// make db connection available to all models
module.exports.db = db;
// import and use routes
const userRoutes = require('./routes/user');
const bankAccountRoutes = require('./routes/bank_account');
// use the routes
app.use('/api', userRoutes);
app.use('/api', bankAccountRoutes);

// handle the request at localhost port 5000
app.get('/', (req, res) => {
  res.send('WCU API is running!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});